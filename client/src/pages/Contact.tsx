import React from "react";
import ContactBanner from "../components/contact/ContactBanner";
import ContactForm from "../components/contact/ContactForm";

type Props = {};

const Contact = (props: Props) => {
  return (
    <div>
      <ContactBanner />
      <ContactForm />
    </div>
  );
};

export default Contact;
