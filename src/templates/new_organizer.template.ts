import { ISendOrganizerCredentials } from '../types/mail_template.interface'

class SendNewOrganizerTemplate {
  sendNewOrganizerEmail(body: ISendOrganizerCredentials) {
    return `<!doctype html>
<html>
<head><title>Welcome to the Digital Platform - University Of Macerata</title></head>
  <body>
    <div
      style='background-color:#F5F5F5;color:#262626;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0.15008px;line-height:1.5;margin:0;padding:32px 0;min-height:100%;width:100%'
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
              <div style="padding:16px 24px 16px 24px;text-align:center">
                <a
                  href="https://google.com"
                  style="text-decoration:none"
                  target="_blank"
                  ><img
                    alt="Digital Platform"
                    src="https://res.cloudinary.com/djawj996g/image/upload/v1729668294/image_89_abihkp.png"
                    width="180"
                    height="90"
                    style="width:200px;height:75px;outline:none;border:none;text-decoration:none;vertical-align:middle;display:inline-block;max-width:100%"
                /></a>
              </div>
              <div style="background-color:#FFFFFF;padding:16px 24px 16px 24px">
                
                <h3
                  style='font-weight:bold;text-align:center;margin:0;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-size:20px;padding:16px 24px 16px 24px'
                >
                  Welcome to Digital Platform!
                </h3>
                <div style="font-weight:normal;padding:16px 24px 16px 24px">
                  Hi ${body?.first_name} ${body?.last_name}! A new account for Digital Platform has been created for
                  you. Login to your account with the credentials listed below.
                </div>
                <div style="text-align:center;padding:16px 24px 16px 24px">
                  <a
                    href="https://www.google.com"
                    style="color:#FFFFFF;font-size:12px;font-weight:bold;background-color:#000000;border-radius:64px;display:inline-block;padding:8px 12px;text-decoration:none"
                    target="_blank"
                    ><span
                      ><!--[if mso
                        ]><i
                          style="letter-spacing: 12px;mso-font-width:-100%;mso-text-raise:18"
                          hidden
                          >&nbsp;</i
                        ><!
                      [endif]--></span
                    ><span>Login to Your Account </span
                    ><span
                      ><!--[if mso
                        ]><i
                          style="letter-spacing: 12px;mso-font-width:-100%"
                          hidden
                          >&nbsp;</i
                        ><!
                      [endif]--></span
                    ></a
                  >
                </div>
                <div
                  style='font-family:Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", source-sans-pro, sans-serif;font-weight:normal;text-align:center;padding:16px 24px 16px 24px'
                >
                  <p><b>Email:</b> ${body?.email}<br /><b>Password:</b> ${body?.password}</p>
                </div>
                <div style="padding:16px 0px 16px 0px">
                  <hr
                    style="width:100%;border:none;border-top:1px solid #CCCCCC;margin:0"
                  />
                </div>
                <div
                  style='font-size:13px;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-weight:normal;padding:0px 24px 0px 24px'
                >
                  Sent with ♥️ from Digital Platform
                </div>
                <div
                  style='font-size:13px;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-weight:normal;padding:0px 24px 0px 24px'
                >
                  <p>
                    801, 8th floor Binori B Square-I, BRTS road, Ambli Rd,
                    Ahmedabad, Gujarat 380058<br />©2024 IT Path Solutions. All
                    rights reserved.
                  </p>
                </div>
                <div
                  style='font-size:13px;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-weight:normal;padding:0px 24px 0px 24px'
                >
                  View our privacy notice or contact us.
                </div>
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

const sendNewOrganizerTemplate = new SendNewOrganizerTemplate()

export default sendNewOrganizerTemplate
