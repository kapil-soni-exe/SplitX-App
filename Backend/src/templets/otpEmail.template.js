const otpEmailTemplate = (otp) => `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background:#f4f6f8; font-family: Arial;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 0;">
          <table width="420" style="background:#ffffff; padding:30px; border-radius:8px;">
            
            <tr>
              <td align="center">
                <h2 style="margin:0;">SplitX</h2>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:15px 0;">
                <p>Use the OTP below to verify your email</p>
              </td>
            </tr>

            <tr>
              <td align="center">
                <div style="
                  font-size:24px;
                  font-weight:bold;
                  letter-spacing:4px;
                  background:#f3f4f6;
                  padding:12px 24px;
                  border-radius:6px;
                  display:inline-block;
                ">
                  ${otp}
                </div>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding-top:20px; font-size:12px; color:#6b7280;">
                OTP is valid for 10 minutes
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

module.exports = otpEmailTemplate;