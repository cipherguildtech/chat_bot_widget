import { useState } from "react";
import FloatingButton from "./FloatingButton";
import ChatWindow from "./ChatWindow";

export default function Widget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <ChatWindow onClose={() => setOpen(false)} />}

      <FloatingButton onClick={() => setOpen(!open)} />
    </>
  );
}