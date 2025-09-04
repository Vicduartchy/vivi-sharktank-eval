import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, Loader2, Brain } from "lucide-react";

interface ProjectEvaluatorProps {
  content: string;
  onEvaluationComplete: (results: any) => void;
}

// SHARK TANK PROJECT MANAGEMENT Checklist
const SHARK_TANK_CHECKLIST = {
  "Encontro 1A": {
    title: "Business Case",
    items: [
      {
        id: "1a_business_case",
        name: "Business Case completo",
        questions: [
          "O problema de negócio está claramente definido?",
          "A justificativa financeira está apresentada?",
          "Os benefícios esperados são mensuráveis?"
        ]
      }
    ]
  },
  "Encontro 1B": {
    title: "Termo de Abertura",
    items: [
      {
        id: "1b_termo_abertura",
        name: "Termo de Abertura do Projeto",
        questions: [
          "Os objetivos do projeto estão claramente definidos?",
          "O escopo preliminar está delimitado?",
          "Os stakeholders principais foram identificados?"
        ]
      }
    ]
  },
  "Encontro 2A": {
    title: "Estrutura Analítica do Projeto",
    items: [
      {
        id: "2a_eap",
        name: "EAP (Estrutura Analítica do Projeto)",
        questions: [
          "A decomposição do trabalho está completa?",
          "Os pacotes de trabalho estão bem definidos?",
          "A hierarquia está logicamente estruturada?"
        ]
      }
    ]
  },
  "Encontro 2B": {
    title: "Cronograma e Recursos",
    items: [
      {
        id: "2b_cronograma",
        name: "Cronograma detalhado",
        questions: [
          "As atividades têm dependências claras?",
          "Os recursos estão adequadamente alocados?",
          "O caminho crítico foi identificado?"
        ]
      }
    ]
  },
  "Encontro 3A": {
    title: "Orçamento e Riscos",
    items: [
      {
        id: "3a_orcamento",
        name: "Orçamento e Análise de Riscos",
        questions: [
          "O orçamento está detalhado por categoria?",
          "Os principais riscos foram identificados?",
          "As estratégias de resposta aos riscos estão definidas?"
        ]
      }
    ]
  },
  "Encontro 3B": {
    title: "Plano de Comunicação",
    items: [
      {
        id: "3b_comunicacao",
        name: "Plano de Comunicação",
        questions: [
          "Os canais de comunicação estão definidos?",
          "A matriz de responsabilidades está clara?",
          "A frequência de reportes está estabelecida?"
        ]
      }
    ]
  },
  "Encontro 4A": {
    title: "Monitoramento e Controle",
    items: [
      {
        id: "4a_monitoramento",
        name: "Plano de Monitoramento e Controle",
        questions: [
          "Os indicadores de desempenho estão definidos?",
          "O processo de controle de mudanças está estabelecido?",
          "Os marcos de controle estão identificados?"
        ]
      }
    ]
  },
  "Encontro 4B": {
    title: "Encerramento e Lições Aprendidas",
    items: [
      {
        id: "4b_encerramento",
        name: "Plano de Encerramento",
        questions: [
          "Os critérios de aceitação estão definidos?",
          "O processo de transição está planejado?",
          "As lições aprendidas foram documentadas?"
        ]
      }
    ]
  }
};

export const ProjectEvaluator = ({ content, onEvaluationComplete }: ProjectEvaluatorProps) => {
  const [evaluating, setEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const evaluateProject = async () => {
    setEvaluating(true);
    setProgress(0);
    
    try {
      const evaluationResults: any = {
        encontros: {},
        totalScore: 8,
        penalidades: 0,
        bonus: 0,
        finalScore: 8,
        approvedItems: 0,
        totalItems: 0,
        feedback: {}
      };

      const totalEncontros = Object.keys(SHARK_TANK_CHECKLIST).length;
      let encontroIndex = 0;

      // Simulate AI evaluation for each encontro
      for (const [encontroKey, encontro] of Object.entries(SHARK_TANK_CHECKLIST)) {
        setCurrentEvaluation(`Avaliando ${encontroKey}: ${encontro.title}`);
        setProgress(((encontroIndex + 1) / totalEncontros) * 100);

        // Simulate evaluation delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const encontroResults: any = {
          title: encontro.title,
          items: {}
        };

        let encontroApproved = 0;

        for (const item of encontro.items) {
          // Simulate AI analysis
          const isApproved = Math.random() > 0.3; // 70% chance of approval for demo
          
          encontroResults.items[item.id] = {
            name: item.name,
            approved: isApproved,
            questions: item.questions.map(q => ({
              question: q,
              satisfied: isApproved ? Math.random() > 0.1 : Math.random() > 0.7
            })),
            feedback: isApproved 
              ? "Entregável atende aos critérios estabelecidos."
              : "Entregável necessita melhorias. Verifique os pontos destacados nas perguntas."
          };

          if (isApproved) {
            encontroApproved++;
            evaluationResults.approvedItems++;
          }

          evaluationResults.totalItems++;
        }

        // Se ambos entregáveis do encontro foram reprovados, aplicar penalidade
        if (encontroApproved === 0) {
          evaluationResults.penalidades++;
          evaluationResults.totalScore--;
        }

        evaluationResults.encontros[encontroKey] = encontroResults;
        encontroIndex++;
      }

      // Calcular nota final
      evaluationResults.finalScore = Math.max(0, evaluationResults.totalScore);
      
      // Bônus para projeto completamente aprovado (simulado)
      if (evaluationResults.approvedItems === evaluationResults.totalItems) {
        evaluationResults.bonus = 2;
        evaluationResults.finalScore = Math.min(10, evaluationResults.finalScore + evaluationResults.bonus);
      }

      // Feedback qualitativo geral
      evaluationResults.qualitativeFeedback = {
        "Competência Técnica (30%)": evaluationResults.approvedItems / evaluationResults.totalItems > 0.8 ? "Excelente" : "Bom",
        "Uso Estratégico de IA (25%)": "Adequado - projeto demonstra integração básica",
        "Capacidade de Gestão de Crise (25%)": "Satisfatório - planos de contingência presentes",
        "Comunicação e Transparência (20%)": "Bom - documentação clara e objetiva"
      };

      setResults(evaluationResults);
      onEvaluationComplete(evaluationResults);

      toast({
        title: "Avaliação concluída!",
        description: `Nota final: ${evaluationResults.finalScore}/10`,
      });

    } catch (error) {
      toast({
        title: "Erro na avaliação",
        description: "Não foi possível completar a avaliação do projeto",
        variant: "destructive",
      });
    } finally {
      setEvaluating(false);
    }
  };

  if (!evaluating && !results) {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-3">
          <Brain className="h-16 w-16 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Pronto para Avaliar</h3>
          <p className="text-muted-foreground">
            A Vivi irá analisar o conteúdo usando o checklist SHARK TANK PROJECT MANAGEMENT
          </p>
        </div>

        <Card className="text-left">
          <CardHeader>
            <CardTitle className="text-lg">Critérios de Avaliação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {Object.entries(SHARK_TANK_CHECKLIST).map(([key, encontro]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Badge variant="outline">{key}</Badge>
                  <span>{encontro.title}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
              <p className="font-medium mb-2">Sistema de Pontuação:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Base: 8 pontos (1 por encontro)</li>
                <li>• Penalidade: -1 se ambos entregáveis reprovados</li>
                <li>• Bônus: +2 para projeto completamente aprovado</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Button onClick={evaluateProject} className="w-full">
          <Brain className="h-4 w-4 mr-2" />
          Iniciar Avaliação com IA
        </Button>
      </div>
    );
  }

  if (evaluating) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Loader2 className="h-16 w-16 mx-auto animate-spin text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Avaliando Projeto...</h3>
          <p className="text-muted-foreground">{currentEvaluation}</p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progresso da Avaliação</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(SHARK_TANK_CHECKLIST).map(([key, encontro]) => (
            <Card key={key} className={`${progress > (Object.keys(SHARK_TANK_CHECKLIST).indexOf(key) / Object.keys(SHARK_TANK_CHECKLIST).length * 100) ? 'bg-green-50 border-green-200' : ''}`}>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  {progress > (Object.keys(SHARK_TANK_CHECKLIST).indexOf(key) / Object.keys(SHARK_TANK_CHECKLIST).length * 100) ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{key}</p>
                    <p className="text-xs text-muted-foreground">{encontro.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return null;
};