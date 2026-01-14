import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Avatar,
  Divider,
  useUser,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { getAIResponse } from "../../utils/aiRespose";
import { useParametersRealTime } from "../../hooks/useParametersRealTime";
import { useUserContext } from "../../context/userContext";
import { ParametroTipo } from "../../interfaces";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const { acuarioSeleccionado } = useUserContext();
  const { filteredParameters } = useParametersRealTime();
  console.log(filteredParameters);

  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy AquaBot, tu asistente para el cuidado de tu acuario. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");

    const parametersInfo = filteredParameters
      .map((param) => {
        if (param.tipo === ParametroTipo.TEMPERATURA) {
          return `${param.tipo}: ${param.valor} (Ideal (puesto por el usuario): Max — ${acuarioSeleccionado.temp_max}, Min — ${acuarioSeleccionado.temp_min})`;
        }
        if (param.tipo === ParametroTipo.PH) {
          return `${param.tipo}: ${param.valor} (Ideal (puesto por el usuario): Max — ${acuarioSeleccionado.ph_max}, Min — ${acuarioSeleccionado.ph_min})`;
        }
        return `${param.tipo}: ${param.valor}`;
      })
      .join(", ");

    console.log(inputValue + `—— ${parametersInfo}`);

    getAIResponse(
      inputValue + `—— ${parametersInfo}`,
      (res: string) => {
        const botMessage: Message = {
          id: messages.length + 2,
          text: res,
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
      },
      {
        systemRole:
          "Eres un asistente experto en el cuidado de acuarios de agua dulce y salada. Proporciona consejos útiles y respuestas claras a las preguntas de los usuarios sobre mantenimiento, especies de peces, calidad del agua y decoración del acuario. Proporcionas respuestas breves, concisas y resumidas, en texto plano (NO MARKDOWN), puedes saltar líneas. No respondas preguntas que no estén relacionadas con acuarios, los parámetros actuales del acuario serán enviados junto con el mensaje del usuario después de ——, pero solo responde las preguntas del usuario según esos parámetros y no respondas con los parámetros a menos que se te haya pedido explicitamente.",
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Auto scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-24 right-4 z-40 w-80 md:w-96"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="shadow-xl h-[450px] flex flex-col">
            <CardHeader className="flex justify-between items-center bg-primary text-white">
              <div className="flex items-center gap-2">
                <Avatar
                  src="https://img.heroui.chat/image/avatar?w=200&h=200&u=bot"
                  size="sm"
                  className="border-2 border-white"
                />
                <div>
                  <p className="font-medium">AquaBot</p>
                  <p className="text-xs opacity-80">Asistente de acuarios</p>
                </div>
              </div>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={onClose}
                className="text-white"
              >
                <Icon icon="lucide:minimize-2" />
              </Button>
            </CardHeader>

            <CardBody className="p-0 flex-grow flex flex-col">
              <div className="flex-grow overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-default-100 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <Divider />

              <div className="p-2 flex gap-2">
                <Input
                  placeholder="Escribe un mensaje..."
                  value={inputValue}
                  onValueChange={setInputValue}
                  onKeyPress={handleKeyPress}
                  className="flex-grow input-no-zoom"
                  size="sm"
                  endContent={
                    <Button
                      isIconOnly
                      color="primary"
                      size="sm"
                      variant="light"
                      onPress={handleSendMessage}
                      isDisabled={!inputValue.trim()}
                    >
                      <Icon icon="lucide:send" className="text-sm" />
                    </Button>
                  }
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
