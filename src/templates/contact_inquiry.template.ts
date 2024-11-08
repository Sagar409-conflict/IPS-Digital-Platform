import { ISendContactInquiry, ISendForgotPassword } from '../types/mail_template.interface'

class SendContactInquiryTemplate {
  sendContactInquiryEmail(body: ISendContactInquiry) {
    return `
   <!doctype html>
<html>
  <head><title>Thank You for Reaching Out to ${process.env.COMPANY_NAME}</title></head>
  <body>
    <div
      style='background-color:#F2F5F7;color:#000000;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0.15008px;line-height:1.5;margin:0;padding:32px 0;min-height:100%;width:100%'
    >
      <table
        align="center"
        width="100%"
        style="margin:0 auto;max-width:600px;background-color:#FFFFFF"
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        border="0"
      >
        <tbody>
          <tr style="width:100%">
            <td>
              <div style="padding:24px 0px 24px 24px;text-align:center">
                <a
                  href="https://google.com"
                  style="text-decoration:none"
                  target="_blank"
                  ><img
                    alt="Support Agent"
                    src="https://res.cloudinary.com/djawj996g/image/upload/v1729668294/image_89_abihkp.png"
                    width="200"
                    style="width:200px;outline:none;border:none;text-decoration:none;vertical-align:middle;display:inline-block;max-width:100%"
                /></a>
              </div>
              <div style="font-weight:normal;padding:0px 24px 8px 24px">
                Dear ${body.full_name},
              </div>
              <div style="font-weight:normal;padding:16px 24px 16px 24px">
                Thank you for contacting ${process.env.COMPANY_NAME}. We appreciate your
                interest and the time you&#x27;ve taken to reach out to us.
              </div>
              <div style="font-weight:normal;padding:0px 24px 16px 24px">
                We have received your message and would like to assure you that
                your inquiry is important to us. A member of our team will
                review your message and respond as soon as possible to provide
                the information you need or assist with any questions.
              </div>
              <div style="font-weight:normal;padding:0px 24px 16px 24px">
                In the meantime, if you have any additional information that
                could help us address your inquiry more effectively, please feel
                free to share it by replying to this email.
              </div>
              <div style="font-weight:normal;padding:0px 24px 16px 24px">
                Thank you once again for reaching out to ${process.env.COMPANY_NAME}. We
                look forward to assisting you.
              </div>
              <div style="font-weight:normal;padding:8px 24px 0px 24px">
                Thanks,
              </div>
              <div style="font-weight:normal;padding:0px 16px 0px 24px">
                University of Mecerata Team
              </div>
              <div style="padding:48px 0px 16px 0px">
                <hr
                  style="width:100%;border:none;border-top:1px solid #CCCCCC;margin:0"
                />
              </div>
              <div
                style='font-size:13px;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-weight:normal;padding:20px 24px 0px 24px'
              >
                Sent with ♥️ from University of Mecerata
              </div>
              <div style="border-radius:20px;padding:0px 24px 0px 24px">
                <div
                  style='font-size:13px;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-weight:normal;padding:0px 0px 0px 0px'
                >
                  <p>
                    801, 8th floor Binori B Square-I, BRTS road, Ambli Rd,
                    Ahmedabad, Gujarat 380058<br />©2024 IT Path Solutions. All
                    rights reserved.
                  </p>
                </div>
              </div>
              <div
                style='font-size:13px;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-weight:normal;padding:0px 0px 8px 24px'
              >
                View our privacy notice or contact us.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>
    `
  }
}
const sendContactInquiryTemplate = new SendContactInquiryTemplate()

export default sendContactInquiryTemplate
