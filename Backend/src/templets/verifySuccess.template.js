const verifySuccessTemplate = (name) => `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background:#f4f6f8; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 0;">
          
          <table width="420" style="
            background:#ffffff;
            padding:30px;
            border-radius:8px;
            box-shadow:0 4px 10px rgba(0,0,0,0.05);
          ">
            
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <h2 style="margin:0; color:#111827;">SplitX</h2>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding-bottom:10px;">
                <h3 style="margin:0; color:#111827;">
                  Email Verified Successfully 🎉
                </h3>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding-bottom:20px;">
                <p style="margin:0; color:#6b7280; font-size:14px;">
                  Hi ${name || "there"}, your email address has been successfully verified.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding-bottom:20px;">
                <p style="margin:0; color:#6b7280; font-size:14px;">
                  You can now securely log in and start using SplitX.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center">
                <p style="margin:0; color:#9ca3af; font-size:12px;">
                  If this wasn’t you, please secure your account immediately.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
</html>
`;

module.exports = verifySuccessTemplate;