import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {name, email, subject, message } = body;
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASS,
      },
    });


  const mailOptionsToUser = {
      from: process.env.ZOHO_USER,
      to: email,
      subject: 'Thank you for contacting us!',
      html: `
      
      <table style="text-align: center;max-width: 400px;font-family: sans-serif;margin:auto">
      <tr>
        <td>
          <img
            height="250"
            width="400"
            src="https://postimg.cc/3kn7DwCV"
            alt="techunter"
          />
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0;">
          <h2 style="margin: 0">Dear ,c  <strong>${name}</strong></h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0;">
          Thank you for your email! We appreciate you taking the time to reach out to us. Our team will contact you soon.
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0;">
          While you're here, we invite you to check out our latest blog post on our website. It’s packed with insights
          and information that we believe you will find interesting and helpful.
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0;">
          Feel free to explore, and if you have any questions or need further assistance, don’t hesitate to let us know!
        </td>
      </tr>
      <tr>
        <td style="text-align: center; padding: 20px 0">
          <a
            style="
              margin: auto;
              padding: 9px 10px;
              border-radius: 6px;
              border: none;
              background: black;
              color: whitesmoke;
              width: fit-content;
              font-weight: bold;
              text-decoration: none;
            "
            href="https://www.techunterhub.com/"
            >Check out latest blog</a
          >
        </td>
      </tr>
    </table>
      `,
  };

  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: `
        <b>New Message</b>
        <b>Name:</b> ${name}
        <b>Email:</b> ${email}
        <b>Subject:</b> ${subject}
        <b>Message:</b> ${message}
        `,
        parse_mode: 'HTML',
      }),
    }
  )

  
  await Promise.all([
    transporter.sendMail(mailOptionsToUser),
  ])
    return new Response(
      JSON.stringify({
        error: false,
        emailSent: true,
        message: 'Email sent successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: true,
        emailSent: false,
        message:'Email sending failed'+ error,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
