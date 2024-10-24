import { ISendPasswordResetSucessful } from '../types/mail_template.interface'

class SendPasswordResetACKTemplate {
  sendPasswordResetACKEmail(body: ISendPasswordResetSucessful) {
    return `<!doctype html>
<html>
<head><title>Password Reset Successful</title></head>
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
              <div style="padding:24px 0px 24px 24px;text-align:left">
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
              <div style="font-weight:normal;padding:0px 24px 16px 24px">
                Hi ${body.first_name} ${body.last_name} 👋,
              </div>
              <div style="font-weight:normal;padding:16px 24px 0px 24px">
                We’re pleased to inform you that your password has been
                successfully reset. You can now log in to your account using
                your new password.
              </div>
              <div style="font-weight:normal;padding:0px 24px 4px 24px">
                <p>
                  If you did not initiate this request or if you have any
                  concerns, please contact our support team immediately.
                </p>
                <p>Thank you for being a valued member of our community!</p>
              </div>
              <div style="font-weight:normal;padding:8px 24px 0px 24px">
                Best Regards,
              </div>
              <div style="font-weight:normal;padding:0px 16px 0px 24px">
                University of Mecerata Team
              </div>
              <div style="padding:40px 0px 16px 0px">
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
</html>`
  }
}

const sendPasswordResetACKTemplate = new SendPasswordResetACKTemplate()
export default sendPasswordResetACKTemplate