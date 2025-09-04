import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileText, Loader2, Check, X } from "lucide-react";

interface FileUploaderProps {
  onFilesUploaded: (files: File[]) => void;
  onContentExtracted: (content: string) => void;
}

export const FileUploader = ({ onFilesUploaded, onContentExtracted }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedContent, setExtractedContent] = useState<string>('');
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const isValid = file.type === 'application/pdf' || 
                     file.type === 'text/plain' ||
                     file.type === 'application/vnd.ms-excel' ||
                     file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      
      if (!isValid) {
        toast({
          title: "Arquivo não suportado",
          description: `${file.name} não é um tipo de arquivo válido`,
          variant: "destructive",
        });
      }
      
      return isValid;
    });

    setFiles(prev => [...prev, ...validFiles]);
    onFilesUploaded([...files, ...validFiles]);
  }, [files, onFilesUploaded, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: true
  });

  const extractContent = async () => {
    if (files.length === 0) return;

    setProcessing(true);
    setProgress(0);

    try {
      let allContent = '';
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(((i + 1) / files.length) * 100);

        if (file.type === 'text/plain') {
          const text = await file.text();
          allContent += `\n\n=== ${file.name} ===\n${text}`;
        } else if (file.type === 'application/pdf') {
          // Simulate PDF extraction (in real app, you'd use pdf.js or server-side OCR)
          allContent += `\n\n=== ${file.name} ===\n[Conteúdo PDF extraído via OCR - implementação completa necessária]`;
        } else if (file.type.includes('spreadsheet') || file.type.includes('excel')) {
          // Simulate Excel extraction
          allContent += `\n\n=== ${file.name} ===\n[Conteúdo de planilha extraído - implementação completa necessária]`;
        }
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setExtractedContent(allContent);
      onContentExtracted(allContent);
      
      toast({
        title: "Conteúdo extraído com sucesso!",
        description: `Processados ${files.length} arquivo(s)`,
      });
    } catch (error) {
      toast({
        title: "Erro na extração",
        description: "Não foi possível extrair o conteúdo dos arquivos",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesUploaded(newFiles);
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <Card>
        <CardContent className="p-0">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary'}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium text-primary">Solte os arquivos aqui...</p>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">
                  Arraste arquivos aqui ou clique para selecionar
                </p>
                <p className="text-sm text-muted-foreground">
                  Suporte a PDF, TXT, XLS e XLSX
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Arquivos Selecionados</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing */}
      {files.length > 0 && !extractedContent && (
        <div className="flex justify-center">
          <Button 
            onClick={extractContent} 
            disabled={processing}
            className="flex items-center space-x-2"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Extraindo conteúdo...</span>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                <span>Extrair Conteúdo</span>
              </>
            )}
          </Button>
        </div>
      )}

      {processing && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processando arquivos...</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {extractedContent && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 text-green-800">
              <Check className="h-5 w-5" />
              <div>
                <p className="font-medium">Conteúdo extraído com sucesso!</p>
                <p className="text-sm">Pronto para avaliação</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};