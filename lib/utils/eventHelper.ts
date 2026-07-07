export interface HostPaymentInfo {
  phone: string;
  bank_name: string;
  bank_account: string;
  account_holder: string;
}

export interface ParsedEvent {
  mainDescription: string;
  paymentInfo: HostPaymentInfo | null;
}

/**
 * Parses the event description to extract main description and host payment metadata.
 */
export function parseEventDescription(rawDescription: string): ParsedEvent {
  if (!rawDescription) {
    return { mainDescription: "", paymentInfo: null };
  }

  const regex = /<!--HOST_PAYMENT_METADATA:({[\s\S]*?})-->/;
  const match = rawDescription.match(regex);

  if (match && match[1]) {
    try {
      const paymentInfo = JSON.parse(match[1]) as HostPaymentInfo;
      // Remove the metadata tag from the main description
      const mainDescription = rawDescription.replace(regex, "").trim();
      return { mainDescription, paymentInfo };
    } catch (e) {
      console.error("Failed to parse host payment info JSON", e);
    }
  }

  return { mainDescription: rawDescription, paymentInfo: null };
}

/**
 * Encodes the main description and host payment metadata into a single string.
 */
export function encodeEventDescription(mainDescription: string, paymentInfo: HostPaymentInfo): string {
  const jsonString = JSON.stringify(paymentInfo);
  return `${mainDescription.trim()}\n\n<!--HOST_PAYMENT_METADATA:${jsonString}-->`;
}
