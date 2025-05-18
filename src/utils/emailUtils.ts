
interface EmailData {
  name: string;
  email: string;
  phone: string;
  message: string;
  location?: string;
}

export const sendEmail = async (data: EmailData): Promise<void> => {
  console.log("Sending email with data:", data);
  
  // In a real implementation, you would make an API call to your server
  return new Promise((resolve) => {
    // Mock a successful email send with a delay
    setTimeout(() => {
      console.log("Email sent successfully");
      resolve();
    }, 1500);
  });
};

export const sendOrderEmail = async (data: any): Promise<void> => {
  console.log("Sending order email with data:", data);
  
  // In a real implementation, you would make an API call to your server
  return new Promise((resolve) => {
    // Mock a successful email send with a delay
    setTimeout(() => {
      console.log("Order email sent successfully");
      resolve();
    }, 1500);
  });
};
