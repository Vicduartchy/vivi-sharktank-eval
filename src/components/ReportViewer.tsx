import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Download, Presentation, Mail, BarChart3 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ReportViewerProps {
  results: any;
  projectContent: string;
}

export const ReportViewer = ({ results }: ReportViewerProps) => {
  const { toast } = useToast();

  const handleSaveReport = async () => {
    // TODO: Implement Supabase save
    toast({
      title: "Relatório salvo!",
      description: "Relatório foi salvo no banco de dados",
    });
  };

  const handleEmailReport = async () => {
    // TODO: Implement email functionality
    toast({
      title: "Email enviado!",
      description: "Relatório foi enviado por email",
    });
  };

  const handleProjectToScreen = () => {
    // TODO: Implement fullscreen projection
    toast({
      title: "Modo apresentação ativado",
      description: "Relatório agora está sendo projetado",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-green-600";
    if (score >= 7) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 9) return "default";
    if (score >= 7) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      {/* Header com nota final */}
      <Card className="border-primary">
        <CardHeader className="text-center">
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mb-4">
            <BarChart3 className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-2xl">Relatório de Avaliação</CardTitle>
          <div className="space-y-2">
            <div className={`text-4xl font-bold ${getScoreColor(results.finalScore)}`}>
              {results.finalScore}/10
            </div>
            <Badge variant={getScoreBadgeVariant(results.finalScore)} className="text-lg px-4 py-1">
              {results.finalScore >= 9 ? "Excelente" : 
               results.finalScore >= 7 ? "Bom" : "Necessita Melhorias"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Ações */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSaveReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Salvar Relatório
            </Button>
            <Button onClick={handleEmailReport} variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Enviar por Email
            </Button>
            <Button onClick={handleProjectToScreen} className="bg-gradient-to-r from-primary to-accent">
              <Presentation className="h-4 w-4 mr-2" />
              Projetar na Tela
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Geral */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Geral</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{results.approvedItems}</div>
              <div className="text-sm text-muted-foreground">Aprovados</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-red-600">{results.totalItems - results.approvedItems}</div>
              <div className="text-sm text-muted-foreground">Reprovados</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{results.penalidades}</div>
              <div className="text-sm text-muted-foreground">Penalidades</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{results.bonus}</div>
              <div className="text-sm text-muted-foreground">Bônus</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Taxa de Aprovação</span>
              <span>{Math.round((results.approvedItems / results.totalItems) * 100)}%</span>
            </div>
            <Progress value={(results.approvedItems / results.totalItems) * 100} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Detalhamento por Encontro */}
      <div className="grid gap-4">
        {Object.entries(results.encontros).map(([encontroKey, encontro]: [string, any]) => (
          <Card key={encontroKey}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{encontroKey}: {encontro.title}</span>
                <Badge variant={Object.values(encontro.items).every((item: any) => item.approved) ? "default" : "destructive"}>
                  {Object.values(encontro.items).filter((item: any) => item.approved).length}/
                  {Object.values(encontro.items).length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(encontro.items).map(([itemId, item]: [string, any]) => (
                <div key={itemId} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    {item.approved ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{item.feedback}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Perguntas de Avaliação:</h5>
                        {item.questions.map((q: any, qIndex: number) => (
                          <div key={qIndex} className="flex items-start space-x-2 text-sm">
                            {q.satisfied ? (
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                            )}
                            <span className={q.satisfied ? "text-green-700" : "text-red-700"}>
                              {q.question}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {!item.approved && (
                        <div className="bg-red-50 border border-red-200 rounded p-3">
                          <h6 className="font-medium text-red-800 mb-1">Sugestões de Melhoria:</h6>
                          <p className="text-sm text-red-700">
                            Revisar os pontos não atendidos e detalhar melhor as informações solicitadas.
                            {itemId.includes('cronograma') && " Especialmente importante definir dependências claras entre atividades."}
                            {itemId.includes('riscos') && " Foco especial na identificação e estratégias de mitigação de riscos."}
                            {itemId.includes('comunicacao') && " Detalhar melhor os canais e frequência de comunicação."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feedback Qualitativo */}
      <Card>
        <CardHeader>
          <CardTitle>Avaliação Qualitativa Integrada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {Object.entries(results.qualitativeFeedback).map(([criteria, rating]: [string, any]) => (
              <div key={criteria} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">{criteria}</span>
                <Badge variant="outline">{rating}</Badge>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Comentários da Vivi:</h4>
            <p className="text-sm text-blue-700">
              "Este projeto demonstra {results.finalScore >= 8 ? 'boa' : 'adequada'} aplicação dos conceitos de gerenciamento de projetos. 
              {results.penalidades === 0 ? 'Parabéns pela completude dos entregáveis!' : 'Recomendo revisar os itens destacados para melhorar a qualidade geral.'}
              {results.bonus > 0 ? ' O projeto está pronto para apresentação no Shark Tank!' : ' Com os ajustes sugeridos, o projeto estará pronto para a apresentação final.'}"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};