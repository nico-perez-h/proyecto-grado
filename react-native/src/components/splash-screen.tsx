import React from "react";
import { motion } from "framer-motion";
import { Logo } from "./logo";

export const SplashScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >
        <div className="relative">
          <Logo size="lg" showText={false} />
          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full -z-10 w-16 h-16"
          />
        </div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl font-bold mt-4 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent"
        >
          AquaMonitor
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8"
        >
          <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-primary-300 to-secondary-300 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
      
      <div className="absolute bottom-8 text-center">
        <p className="text-foreground-500 text-sm">Monitoreo inteligente para tu acuario</p>
      </div>
    </div>
  );
};