import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="p-8">
      <section className="max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="text-muted-foreground">We're happy to hear from you — call, message, or drop by. Our team is available to assist with orders, fittings and general enquiries.</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h2 className="font-semibold">Phone</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="tel:+9779841898731" className="text-primary">+977 98418 98731</a> — Store / General</li>
              <li><a href="tel:+9779843183764" className="text-primary">+977 98431 83764</a> — Orders & WhatsApp</li>
              <li><a href="tel:+9779865481109" className="text-primary">+977 98654 81109</a> — Support</li>
            </ul>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="font-semibold">Email & Hours</h2>
            <p className="mt-3 text-sm"><a href="mailto:dummy@example.com" className="text-primary">dummy@example.com</a></p>
            <p className="mt-3 text-sm">Hours: Mon–Sat, 10:00 — 19:00</p>
            <p className="mt-3 text-sm">Address: Jagatsundar Marg, Kathmandu, Nepal</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
