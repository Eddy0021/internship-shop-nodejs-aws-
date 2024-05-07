export const handleError = (statusCode: number, message: string) => {
    return {
      statusCode,
      body: JSON.stringify({ message }),
    };
  }
  