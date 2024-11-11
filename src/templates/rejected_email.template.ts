import { ISendRejectedemail } from '../types/mail_template.interface'

class SendRejectedtemplate {
  sendRejectedEmail(body: ISendRejectedemail) {
    return `<!doctype html>
<!doctype html>
<html>
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
                Hi <b>${body.first_name.charAt(0).toUpperCase() + body.first_name.slice(1)} ${
      body.last_name
    }</b>,
              </div>
              <div style="font-weight:normal;padding:16px 24px 0px 24px">
                We regret to inform you that your ${body.type} submission titled
                <b>${body.title}</b> has been reviewed and was not approved
                for publication.
              </div>
              <div
                style='font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-weight:normal;text-align:left;padding:0px 24px 0px 24px'
              >
                <p>
                  <b>${
                    body.type && body.type !== undefined
                      ? body.type.charAt(0).toUpperCase() + body.type.slice(1)
                      : ''
                  } Title:</b> ${body.title} <br />
                  <b>Reviewed On:</b> ${body.publishedAt} <br />
                  <b>Reason:</b> <ul>${
                    body.reason !== undefined
                      ? body.reason.map((r: string) => `<li>${r.trim()}</li>`).join('')
                      : ''
                  }</ul>                  
                  <b>Status:</b> <span style="color:red;">Rejected</span>
                </p>
              </div>
              <div style="font-weight:normal;padding:0px 24px 4px 24px">
                <p>
                  If you have any questions regarding this decision or wish to
                  discuss any changes, please feel free to reach out. You are
                  welcome to submit updated or new content for consideration at
                  any time.
                </p>
                <p>Thank you for your attention.</p>
              </div>
              <div style="font-weight:normal;padding:8px 24px 0px 24px">
                Best Regards,
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
</html>`
  }
}

const SendRejectedTemplate = new SendRejectedtemplate()
export default SendRejectedTemplate
