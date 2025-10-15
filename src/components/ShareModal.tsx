import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface ShareModalProps {
	url: string;
	onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ url, onClose }) => {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	return (
		<div className="modal-overlay">
			<Card className="modal-content">
				<CardHeader>
					<CardTitle>Share Your Creation</CardTitle>
					<Button variant="ghost" size="icon" onClick={onClose}>
						<i className="fa-solid fa-xmark"></i>
					</Button>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center space-x-2">
						<input type="text" value={url} readOnly className="input" />
						<Button onClick={handleCopy}>{isCopied ? "Copied!" : "Copy"}</Button>
					</div>
					<div className="flex justify-center space-x-4">
						<a
							href={`https://twitter.com/intent/tweet?url=${url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a
              href={`https://www.reddit.com/submit?url=${url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-reddit"></i>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShareModal;
