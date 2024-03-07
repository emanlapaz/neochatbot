import { ReactMediaRecorder } from "react-media-recorder";
import MicroPhoneIcon from "./MicrophoneIcon";

type Props = {
  handleStop: any;
};

function RecordChat({ handleStop }: Props) {
  return (
    <ReactMediaRecorder
      audio
      onStop={handleStop}
      render={({ status, startRecording, stopRecording, error }) => (
        <div className="mt-2 flex flex-col items-center">
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onKeyDown={(e) => e.key === "Space" && startRecording()}
            onKeyUp={(e) => e.key === "Space" && stopRecording()}
            aria-label={
              status === "recording" ? "Stop recording" : "Start recording"
            }
            className={`p-1 rounded-full ${
              status === "recording" ? "bg-red-500" : "bg-white"
            }`}
          >
            <MicroPhoneIcon
              classText={`${
                status === "recording"
                  ? "animate-pulse text-black"
                  : "text-sky-500"
              }`}
            />
          </button>
          {error && <p className="text-red-500">Error: {error}</p>}
        </div>
      )}
    />
  );
}

export default RecordChat;
