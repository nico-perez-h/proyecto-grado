import OpenAI from "openai";

export enum OpenAIModel {
  GPT_4_o_mini = "gpt-4o-mini",
}

export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export const getAIResponse = async (
  prompt: string,
  callback: (res: string) => void,
  options: {
    systemRole: string;
    onSuccess?: () => void;
    onError?: () => void;
    onFinally?: () => void;
  }
) => {
  try {
    const gptKey = "";
    if (!gptKey) {
      throw new NotFoundError("No se ha encontrado la clave de GPT");
    }
    const openai = new OpenAI({
      apiKey: gptKey,
      dangerouslyAllowBrowser: true,
    });

    const model = OpenAIModel.GPT_4_o_mini;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: options.systemRole,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
      response_format: {
        type: "text",
      },
      temperature: 0.4,
      max_completion_tokens: 2400,
    });

    const result = response;
    const fullText = result.choices[0]?.message?.content || "";
    callback(fullText);
    options.onSuccess?.();
  } catch (error) {
    if (error instanceof NotFoundError) {
      const errorMessage = (error as Error).message;
      alert(errorMessage);
    } else {
      alert("Error al comunicarse con el servidor");
      console.error(error);
    }
    options.onError?.();
  } finally {
    options.onFinally?.();
  }
};
