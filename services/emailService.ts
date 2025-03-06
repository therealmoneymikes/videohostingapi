import nodemailer from "nodemailer";



export class EmailService {
    
    static async sendSuccessfulPaymentEmail(userEmail: string, payment: any){
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
    static async sendUnsuccessfulPaymentEmail(userEmail: string, amount: number, currency: string){

        
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
            subject: "Payment Failed",
            text: `Your payment of ${amount} ${currency.toUpperCase()} was unsuccessful!`
        };
    
        await emailTransporter.sendMail(mailOptions);
        console.log("✅ Unsuccesful Payment email sent to", userEmail);
    }


}