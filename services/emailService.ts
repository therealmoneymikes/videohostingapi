import nodemailer from "nodemailer";



export class EmailService {
    static async  sendSuccessfulPaymentEmail(userEmail: string, payment: any){
        const emailTransporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Payment Confirmation",
            text: `Your payment of ${payment.amount} ${payment.currency.toUpperCase()} was successful!`
        };
    
        await emailTransporter.sendMail(mailOptions);
        console.log("✅ Payment email sent to", userEmail);
    }

}