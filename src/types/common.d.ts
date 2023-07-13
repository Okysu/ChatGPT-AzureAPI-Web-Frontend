// user
type user = {
  username: string;
  avatar: string;
};

// auth
type auth = {
  key: string;
};

// model options
type options = {
  model: string;
  maxTokens?: string;
  temperature?: string;
  topP?: string;
  presencePenalty?: string;
  frequencyPenalty?: string;
  single?: boolean;
};

// messages
type message = {
  _id: string;
  role: string;
  content: string;
  created_at: string;
  updated_at?: string;
  choose_flag: boolean;
};

// chat
type chat = {
  _id: string;
  title: string;
  type: string; // TODO: image generate support
  messages: message[];
  created_at: string;
  options: options;
};
