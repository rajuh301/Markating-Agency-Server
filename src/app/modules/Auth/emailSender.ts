import nodemailer from 'nodemailer';
import config from '../../../config';

const emailSender = async (
    email: string,
    html: string
) => {
    const transporter = nodemailer.createTransport({
        // 'host' এবং 'port' এর বদলে 'service' ব্যবহার করা নিরাপদ
        service: "gmail", 
        auth: {
            user: config.emailSender.email,
            pass: config.emailSender.app_pass,
        },
        tls: {
            // নেটওয়ার্ক সমস্যার কারণে অনেক সময় কানেকশন রিজেক্ট হয়, এটি সেটি হ্যান্ডেল করবে
            rejectUnauthorized: false
        }
    });

    try {
        // মেইল পাঠানোর প্রক্রিয়া
        const info = await transporter.sendMail({
            from: `"Flow 👻" <${config.emailSender.email}>`, 
            to: email,
            subject: "Reset password Link", 
            html
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Email Sender Error:", error);
        throw new Error("Could not send email. Please check SMTP configuration.");
    }
};

export default emailSender;