interface Props {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: Props) {
  return (
    <div className="widget-window">
      <div className="widget-header">
        My Widget
        <button onClick={onClose}>✕</button>
      </div>

      <div className="widget-body">
        Hello from widget 👋
      </div>
    </div>
  );
}