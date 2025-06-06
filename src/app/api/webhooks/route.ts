'use server'

import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.text()
  const body = JSON.parse(payload)

  // Get the Webhook Signing Secret
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const { id } = evt.data
  const eventType = evt.type

  console.log(`🔔 Received webhook with ID ${id} and event type of ${eventType}`)

  try {
    if (evt.type === 'user.created') {
      const { id, email_addresses, username, first_name, last_name, image_url } = evt.data

      // Create user in database
      const user = await prisma.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0]?.email_address || '',
          username: username || null,
          displayName: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || null,
          imageUrl: image_url || null,
        },
      })

      console.log('✅ User created in database:', user.id)
    }

    if (evt.type === 'user.updated') {
      const { id, email_addresses, username, first_name, last_name, image_url } = evt.data

      // Update user in database
      const user = await prisma.user.update({
        where: { clerkId: id },
        data: {
          email: email_addresses[0]?.email_address || '',
          username: username || null,
          displayName: first_name && last_name ? `${first_name} ${last_name}` : first_name || last_name || null,
          imageUrl: image_url || null,
        },
      })

      console.log('✅ User updated in database:', user.id)
    }

    if (evt.type === 'user.deleted') {
      const { id } = evt.data

      // Delete user from database
      const user = await prisma.user.delete({
        where: { clerkId: id || '' },
      })

      console.log('✅ User deleted from database:', user.id)
    }

    return NextResponse.json({ message: 'Webhook received' })
  } catch (error) {
    console.error('🔴 Error processing webhook:', error)
    
    // Return error with details for debugging
    return NextResponse.json(
      { 
        error: 'Error processing webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
        eventType: evt.type,
        eventId: id
      },
      { status: 500 }
    )
  }
} 