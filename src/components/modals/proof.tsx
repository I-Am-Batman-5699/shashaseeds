import { X, Star } from "lucide-react";
import { Testimonial } from "@/types/components/sections/testimonials";

type ProofModalProps = {
    isOpen: boolean;
    onClose: () => void;
    proofUrl?: string;
    name?: string;
    testimony?: Testimonial;
};

const ProofModal: React.FC<ProofModalProps> = ({ isOpen, onClose, testimony }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="relative w-[90%] max-w-lg rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-lg flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute right-3 top-3 rounded-full p-1 text-zinc-600 hover:bg-zinc-400"
                    onClick={onClose}
                >
                    <X className="h-5 w-5" />
                </button>

                <p className="mb-2 text-lg font-semibold text-zinc-900/90">{testimony?.name}</p>

                {testimony && testimony.image ? (
                    <div className="flex flex-col items-center">
                        <img
                            src={testimony.image}
                            alt={`${testimony.name}'s proof`}
                            className="w-full rounded-lg border object-contain"
                        />
                        <div className="flex items-center gap-1 m-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < testimony.rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-800/50"}`}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600">No proof uploaded.</p>
                )}
            </div>
        </div>
    );
};

export default ProofModal;
