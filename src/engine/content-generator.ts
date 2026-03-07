import messagesData from "../data/messages.json";
import hiddenMessagesData from "../data/hidden-messages.json";

const MESSAGE_PROBABILITY = 0.18;
const HIDDEN_MESSAGE_PROBABILITY = 0.005;
const FALLBACK_MESSAGE = "void stream stable";
const HIDDEN_FALLBACK_MESSAGE = "emerald signal";

export interface GeneratedSectionContent {
  minHeightPx: number;
  text: string;
  hasMessage: boolean;
  isHiddenMessage: boolean;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMessageList(): string[] {
  const raw = messagesData.voidMessages;
  if (!Array.isArray(raw)) {
    return [FALLBACK_MESSAGE];
  }
  const cleaned = raw.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return cleaned.length > 0 ? cleaned : [FALLBACK_MESSAGE];
}

function getHiddenMessageList(): string[] {
  const raw = hiddenMessagesData.hiddenMessages;
  if (!Array.isArray(raw)) {
    return [HIDDEN_FALLBACK_MESSAGE];
  }
  const cleaned = raw.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return cleaned.length > 0 ? cleaned : [HIDDEN_FALLBACK_MESSAGE];
}

export function generateSectionContent(index: number): GeneratedSectionContent {
  const minHeightPx = randomInt(240, 520);
  const isHiddenMessage = Math.random() < HIDDEN_MESSAGE_PROBABILITY;
  const hasMessage = isHiddenMessage || Math.random() < MESSAGE_PROBABILITY;
  const messageList = getMessageList();
  const hiddenMessageList = getHiddenMessageList();
  const text = isHiddenMessage
    ? hiddenMessageList[randomInt(0, hiddenMessageList.length - 1)]
    : hasMessage
      ? messageList[randomInt(0, messageList.length - 1)]
      : `void-${index}`;
  return {
    minHeightPx,
    text,
    hasMessage,
    isHiddenMessage
  };
}
