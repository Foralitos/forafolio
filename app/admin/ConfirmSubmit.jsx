"use client";

// El <Form onSubmit> con confirm() del Remix. La Server Action llega ya
// enlazada (bind) desde el Server Component, así que este botón no sabe nada
// de ids ni de Mongo.
export default function ConfirmSubmit({ action, message, children, className }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}
