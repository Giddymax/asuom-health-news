"use client";

const WHATSAPP_NUMBER = "233558813062";

export function ContactForm() {
  function handleSubmit(formData: FormData) {
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const topic = String(formData.get("topic") ?? "");
    const message = String(formData.get("message") ?? "");

    const text = [
      "Hello Asuom Health News,",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Topic: ${topic}`,
      "",
      `Message: ${message}`
    ]
      .filter((line) => line !== null)
      .join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        className="button button-primary whatsapp-cta"
      >
        <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.469 2.027 7.77L0 32l8.43-2.007A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.77-1.85l-.486-.29-5.003 1.192 1.215-4.87-.317-.5A13.267 13.267 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.908c-.398-.199-2.354-1.162-2.72-1.294-.365-.133-.63-.199-.896.199-.266.398-1.03 1.294-1.263 1.56-.232.266-.465.299-.863.1-.398-.2-1.68-.619-3.2-1.974-1.183-1.055-1.981-2.357-2.213-2.755-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.698.199-.232.265-.398.398-.664.132-.265.066-.498-.034-.697-.1-.199-.896-2.16-1.228-2.957-.323-.776-.651-.671-.896-.683l-.763-.013c-.265 0-.697.1-1.063.498-.365.399-1.394 1.362-1.394 3.322s1.427 3.853 1.626 4.119c.199.265 2.808 4.286 6.803 6.013.951.41 1.693.655 2.272.839.954.304 1.823.261 2.51.158.766-.113 2.354-.962 2.686-1.892.332-.93.332-1.727.232-1.892-.099-.166-.365-.265-.763-.465z" />
        </svg>
        Chat with us on WhatsApp
      </a>
      <form className="contact-form" action={handleSubmit}>
        <div className="field-grid">
          <label>
            Full Name
            <input name="name" type="text" required />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Phone
            <input name="phone" type="tel" />
          </label>
          <label>
            Topic
            <input name="topic" type="text" required />
          </label>
          <label className="field-full">
            Message
            <textarea name="message" rows={5} required />
          </label>
        </div>
        <button type="submit" className="button button-primary">
          Send via WhatsApp
        </button>
      </form>
    </>
  );
}
