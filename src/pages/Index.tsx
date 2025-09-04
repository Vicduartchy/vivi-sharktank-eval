import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Brain, BarChart3 } from "lucide-react";
import { FileUploader } from "@/components/FileUploader";
import { ProjectEvaluator } from "@/components/ProjectEvaluator";
import { ReportViewer } from "@/components/ReportViewer";
import { ViviChat } from "@/components/ViviChat";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'evaluate' | 'report'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [extractedContent, setExtractedContent] = useState<string>('');
  const [evaluationResults, setEvaluationResults] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Vivi
                </h1>
                <p className="text-sm text-muted-foreground">
                  Professora Auxiliar de IA - MBA Gerenciamento de Projetos
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={currentStep === 'upload' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentStep('upload')}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </Button>
              <Button
                variant={currentStep === 'evaluate' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentStep('evaluate')}
                disabled={!extractedContent}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Avaliar</span>
              </Button>
              <Button
                variant={currentStep === 'report' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentStep('report')}
                disabled={!evaluationResults}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Relatório</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 'upload' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5 text-primary" />
                    <span>Upload de Arquivos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUploader
                    onFilesUploaded={setUploadedFiles}
                    onContentExtracted={(content) => {
                      setExtractedContent(content);
                      if (content) setCurrentStep('evaluate');
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {currentStep === 'evaluate' && extractedContent && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Avaliação SHARK TANK PROJECT MANAGEMENT</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProjectEvaluator
                    content={extractedContent}
                    onEvaluationComplete={(results) => {
                      setEvaluationResults(results);
                      setCurrentStep('report');
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {currentStep === 'report' && evaluationResults && (
              <ReportViewer 
                results={evaluationResults}
                projectContent={extractedContent}
              />
            )}
          </div>

          {/* Vivi Chat Sidebar */}
          <div className="lg:col-span-1">
            <ViviChat 
              context={{
                currentStep,
                hasFiles: uploadedFiles.length > 0,
                hasContent: !!extractedContent,
                hasResults: !!evaluationResults
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
