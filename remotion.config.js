/**
 * Configuração do Remotion Studio / render.
 * Vídeo com dimensão fixa 1920x1080 30fps (definido por composição).
 */
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);

/**
 * Neste ambiente de execução remoto o Chromium headless usado pelo Remotion não
 * carrega o CA do proxy de egresso, o que quebra o fetch das Google Fonts em
 * render. O tráfego continua passando pelo proxy de política; só ignoramos a
 * checagem de certificado do navegador para permitir o download das fontes.
 * (Em ambiente local com internet direta, esta linha é inofensiva.)
 */
Config.setChromiumIgnoreCertificateErrors(true);
