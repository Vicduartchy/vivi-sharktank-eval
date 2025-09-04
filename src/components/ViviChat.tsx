import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Brain, Send, Mic, MicOff, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ViviChatProps {
  context: {
    currentStep: string;
    hasFiles: boolean;
    hasContent: boolean;
    hasResults: boolean;
  };
}

interface ChatMessage {
  id: string;
  type: 'user' | 'vivi';
  content: string;
  timestamp: Date;
}

export const ViviChat = ({ context }: ViviChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'vivi',
      content: 'Oi! Sou a Vivi, sua professora auxiliar de IA! 👩‍🏫 Estou aqui para te ajudar na avaliação dos projetos do MBA em Gerenciamento de Projetos. Vamos avaliar juntos usando o checklist SHARK TANK PROJECT MANAGEMENT!',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Context-aware messages
  useEffect(() => {
    let contextMessage: ChatMessage | null = null;

    if (context.currentStep === 'upload' && !context.hasFiles) {
      contextMessage = {
        id: `context-${Date.now()}`,
        type: 'vivi',
        content: 'Comece fazendo o upload dos arquivos do projeto (PDFs, planilhas ou textos). Estou pronta para extrair e analisar o conteúdo!',
        timestamp: new Date()
      };
    } else if (context.hasFiles && !context.hasContent) {
      contextMessage = {
        id: `context-${Date.now()}`,
        type: 'vivi',
        content: 'Ótimo! Arquivos carregados. Agora vou extrair o conteúdo para análise. ✨',
        timestamp: new Date()
      };
    } else if (context.hasContent && context.currentStep === 'evaluate') {
      contextMessage = {
        id: `context-${Date.now()}`,
        type: 'vivi',
        content: 'Perfeito! Conteúdo extraído. Agora posso avaliar o projeto usando os critérios do SHARK TANK. Vou verificar cada encontro e seus entregáveis! 🦈',
        timestamp: new Date()
      };
    } else if (context.hasResults && context.currentStep === 'report') {
      contextMessage = {
        id: `context-${Date.now()}`,
        type: 'vivi',
        content: 'Avaliação concluída! 🎉 Agora você pode ver o relatório completo com notas, feedback e sugestões. O que achou da avaliação?',
        timestamp: new Date()
      };
    }

    if (contextMessage) {
      setMessages(prev => {
        // Avoid duplicate context messages
        const hasRecentContext = prev.some(msg => 
          msg.type === 'vivi' && 
          Date.now() - msg.timestamp.getTime() < 5000 && 
          msg.content.includes(contextMessage!.content.substring(0, 20))
        );
        
        if (!hasRecentContext) {
          return [...prev, contextMessage!];
        }
        return prev;
      });
    }
  }, [context]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const viviResponse = generateViviResponse(inputMessage, context);
      const viviMessage: ChatMessage = {
        id: `vivi-${Date.now()}`,
        type: 'vivi',
        content: viviResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, viviMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateViviResponse = (input: string, context: any): string => {
    const lowerInput = input.toLowerCase();
    
    // Response patterns based on user input
    if (lowerInput.includes('nota') || lowerInput.includes('pontuação')) {
      return 'A nota é calculada com base no sistema SHARK TANK: 8 pontos base (1 por encontro), menos 1 ponto para cada encontro com ambos entregáveis reprovados, mais 2 pontos de bônus se o projeto for completamente aprovado! 📊';
    }
    
    if (lowerInput.includes('cronograma') || lowerInput.includes('tempo')) {
      return 'Para o cronograma, preciso ver: dependências claras entre atividades, alocação adequada de recursos e identificação do caminho crítico. Estes são pontos fundamentais! ⏰';
    }
    
    if (lowerInput.includes('risco') || lowerInput.includes('contingência')) {
      return 'Excelente pergunta! Na análise de riscos, verifico se os principais riscos foram identificados, se há estratégias de resposta definidas e se estão categorizados adequadamente. A gestão de crise é crucial! 🚨';
    }
    
    if (lowerInput.includes('comunicação')) {
      return 'No plano de comunicação, analiso se os canais estão bem definidos, se há uma matriz de responsabilidades clara e se a frequência dos reportes está estabelecida. Comunicação é 20% da avaliação! 📢';
    }
    
    if (lowerInput.includes('melhoria') || lowerInput.includes('sugestão')) {
      return 'Minhas sugestões se baseiam nos critérios não atendidos. Foco sempre em: completude da informação, clareza dos objetivos, viabilidade das propostas e aderência às melhores práticas de GP! 💡';
    }
    
    if (lowerInput.includes('obrigad') || lowerInput.includes('obrigat')) {
      return 'Por nada! Estou aqui para ajudar vocês a alcançarem a excelência em gerenciamento de projetos. Juntos, vamos fazer esse projeto brilhar no Shark Tank! 🌟';
    }

    if (lowerInput.includes('shark tank')) {
      return 'O SHARK TANK PROJECT MANAGEMENT é nosso checklist completo que cobre todos os encontros do MBA! Cada encontro tem entregáveis específicos que são avaliados com 3 perguntas essenciais. É a nossa metodologia de excelência! 🦈';
    }

    // Default responses based on context
    if (context.currentStep === 'upload') {
      return 'Estou ansiosa para analisar os arquivos! Lembre-se: aceito PDFs, planilhas e textos. Quanto mais completo o material, melhor será minha avaliação! 📁';
    }
    
    if (context.currentStep === 'evaluate') {
      return 'Durante a avaliação, analiso cada entregável contra os critérios estabelecidos. Uso IA para verificar competência técnica, uso estratégico de tecnologia, gestão de crise e comunicação. É uma análise completa! 🧠';
    }
    
    if (context.currentStep === 'report') {
      return 'O relatório mostra tudo: notas por encontro, feedback específico, sugestões de melhoria e avaliação qualitativa. É seu guia para alcançar a excelência! Tem alguma dúvida específica? 📋';
    }

    // Fallback friendly responses
    const responses = [
      'Interessante! Como professora auxiliar, posso te ajudar com qualquer dúvida sobre avaliação de projetos, metodologias ou critérios. O que mais você gostaria de saber? 🤔',
      'Ótima questão! Minha especialidade é avaliar projetos de MBA em GP. Posso explicar critérios, dar sugestões ou esclarecer dúvidas sobre a metodologia SHARK TANK! 📚',
      'Como sua assistente de IA, estou aqui para tornar a avaliação mais clara e eficiente. Tem alguma pergunta específica sobre o projeto ou os critérios? 💭'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const toggleVoice = () => {
    if (!isListening) {
      // Start voice recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'pt-BR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsListening(true);
          toast({
            title: "Ouvindo...",
            description: "Pode falar! Estou te escutando 🎤",
          });
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
        };

        recognition.onerror = () => {
          toast({
            title: "Erro no reconhecimento",
            description: "Não consegui entender. Tente novamente!",
            variant: "destructive",
          });
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } else {
        toast({
          title: "Não suportado",
          description: "Seu navegador não suporta reconhecimento de voz",
          variant: "destructive",
        });
      }
    } else {
      setIsListening(false);
    }
  };

  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <span>Vivi</span>
            <Badge variant="outline" className="ml-2 text-xs">
              IA Assistente
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex max-w-[80%] space-x-2">
                {message.type === 'vivi' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center flex-shrink-0 mt-1">
                    <Brain className="h-3 w-3 text-white" />
                  </div>
                )}
                
                <div
                  className={`rounded-lg px-3 py-2 text-sm ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-3 w-3" />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center flex-shrink-0 mt-1">
                  <Brain className="h-3 w-3 text-white" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Pergunte algo para a Vivi..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={toggleVoice}
              variant="outline"
              size="icon"
              className={isListening ? "bg-red-100 border-red-300" : ""}
            >
              {isListening ? (
                <MicOff className="h-4 w-4 text-red-600" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};