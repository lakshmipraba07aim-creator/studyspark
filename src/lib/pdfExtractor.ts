import pdfParse from 'pdf-parse';

export interface ExtractionResult {
  text: string;
  pageCount?: number;
  info?: Record<string, unknown>;
  error?: string;
  isTruncated?: boolean;
}

/**
 * Extracts plain text from a PDF Buffer or string input on the server side.
 * Cleans white space, handles errors, and truncates text if excessive.
 */
export async function extractTextFromPDF(buffer: Buffer, maxChars: number = 12000): Promise<ExtractionResult> {
  try {
    if (!buffer || buffer.length === 0) {
      return { text: '', error: 'Uploaded PDF file is empty.' };
    }

    const data = await pdfParse(buffer);
    
    let rawText = data.text || '';
    
    // Clean raw text
    rawText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\u0000/g, '') // remove null characters
      .replace(/[ \t]+/g, ' ') // replace multiple spaces/tabs with single space
      .replace(/\n\s*\n\s*\n+/g, '\n\n') // normalize multiple blank lines
      .trim();

    if (rawText.length < 25) {
      return {
        text: rawText,
        pageCount: data.numpages,
        error: 'The PDF appears to contain very little or no extractable text. It may be a scanned image or empty.',
      };
    }

    let isTruncated = false;
    let finalText = rawText;

    if (rawText.length > maxChars) {
      finalText = rawText.substring(0, maxChars) + '\n\n[... Note: Content truncated for optimal AI processing ...]';
      isTruncated = true;
    }

    return {
      text: finalText,
      pageCount: data.numpages,
      info: data.info,
      isTruncated,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to parse PDF document.';
    console.error('PDF Extraction Error:', message);
    return {
      text: '',
      error: `PDF extraction failed: ${message}. Please ensure the file is a valid non-password-protected PDF.`,
    };
  }
}

/**
 * Cleans plain text file contents or user notes.
 */
export function cleanTextContent(text: string, maxChars: number = 12000): { text: string; isTruncated: boolean } {
  let cleaned = text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();

  let isTruncated = false;
  if (cleaned.length > maxChars) {
    cleaned = cleaned.substring(0, maxChars) + '\n\n[... Content truncated for AI ...]' ;
    isTruncated = true;
  }

  return { text: cleaned, isTruncated };
}
