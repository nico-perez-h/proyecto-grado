import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface ChatbotButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onClick, isOpen }) => {
  return (
    <motion.div
      className="fixed bottom-20 right-4 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Button
        isIconOnly
        color="primary"
        size="lg"
        radius="full"
        className="shadow-lg"
        onPress={onClick}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente"}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <Icon icon="lucide:x" className="text-xl" />
          ) : (
            <Icon icon="lucide:message-circle" className="text-xl" />
          )}
        </motion.div>
      </Button>
    </motion.div>
  );
};