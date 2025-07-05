import { CopyButton } from "@/chatbot-kit/ui/copy-button"

export default function CopyButtonDemo() {
  return (
    <CopyButton
      content="This is a very serious and important message. Thanks for copying it!"
      copyMessage="Copied very important message to clipboard!"
    />
  )
}
