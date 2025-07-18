import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FeedbackRequest {
  type: string;
  rating: number;
  category: string;
  subject: string;
  description: string;
  email?: string;
  timestamp: string;
  page: string;
  userAgent: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const feedback: FeedbackRequest = await req.json();

    // Send feedback email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Feedback System <onboarding@resend.dev>",
      to: ["admin@cloudnetworkingcalculator.com"], // Replace with your admin email
      subject: `New Feedback: ${feedback.subject}`,
      html: `
        <h2>New Feedback Received</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Type:</strong> ${feedback.type}</p>
          <p><strong>Rating:</strong> ${feedback.rating}/5</p>
          <p><strong>Category:</strong> ${feedback.category}</p>
          <p><strong>Subject:</strong> ${feedback.subject}</p>
          <p><strong>Page:</strong> ${feedback.page}</p>
          <p><strong>Timestamp:</strong> ${feedback.timestamp}</p>
          ${feedback.email ? `<p><strong>User Email:</strong> ${feedback.email}</p>` : ''}
        </div>
        
        <h3>Description:</h3>
        <div style="background: white; padding: 15px; border-left: 4px solid #2196F3; margin: 10px 0;">
          ${feedback.description.replace(/\n/g, '<br>')}
        </div>
        
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          <strong>User Agent:</strong> ${feedback.userAgent}
        </p>
      `,
    });

    // Send confirmation email to user if email provided
    let userEmailResponse = null;
    if (feedback.email) {
      userEmailResponse = await resend.emails.send({
        from: "Cloud Networking Calculator <onboarding@resend.dev>",
        to: [feedback.email],
        subject: "Thank you for your feedback!",
        html: `
          <h2>Thank you for your feedback!</h2>
          <p>Dear User,</p>
          <p>We've received your feedback about our Cloud Based Networking Solutions Calculator and truly appreciate you taking the time to help us improve.</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Feedback Summary:</h3>
            <p><strong>Subject:</strong> ${feedback.subject}</p>
            <p><strong>Type:</strong> ${feedback.type}</p>
            <p><strong>Rating:</strong> ${feedback.rating}/5 stars</p>
          </div>
          
          <p>Our team will review your feedback and use it to enhance the calculator's functionality and user experience. If you've reported a bug or requested a feature, we'll prioritize it in our development roadmap.</p>
          
          <p>Keep an eye out for updates to the calculator - your input directly shapes how we improve our networking tools for professionals like you.</p>
          
          <p>Best regards,<br>
          The Cloud Networking Calculator Team</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated response to confirm we received your feedback. If you need immediate assistance, please visit our calculator at <a href="https://cloudnetworkingcalculator.com">cloudnetworkingcalculator.com</a>
          </p>
        `,
      });
    }

    console.log("Feedback emails sent successfully:", { adminEmailResponse, userEmailResponse });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Feedback sent successfully",
      adminEmailSent: !!adminEmailResponse,
      userEmailSent: !!userEmailResponse
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-feedback function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);