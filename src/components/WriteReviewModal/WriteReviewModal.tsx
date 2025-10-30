import React, { useState, useEffect } from 'react';
import { useRating } from '../../contexts/RatingContext';
import './WriteReviewModal.css';

interface ReviewData {
  id: string;
  reviewerName: string;
  rating: number;
  title: string;
  content: string;
  vehicleType: string;
  vehicleModel: string;
  date: string;
  mediaFiles?: File[];
}

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleName?: string;
  vehicleImage?: string;
  onSubmit?: (review: ReviewData) => void;
}

const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  vehicleName = "2025 BMW 3-Series",
  vehicleImage,
  onSubmit
}) => {
  const { getUserRating, setUserRating } = useRating();
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);

  // Load existing user rating when modal opens
  useEffect(() => {
    if (isOpen && vehicleName) {
      const existingRating = getUserRating(vehicleName);
      setRating(existingRating);
    }
  }, [isOpen, vehicleName, getUserRating]);

  // Clean up media preview URLs when component unmounts or modal closes
  useEffect(() => {
    return () => {
      mediaPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [mediaPreviews]);

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
    // Immediately save to global context when user changes rating
    if (vehicleName) {
      setUserRating(vehicleName, selectedRating);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    const previews: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        validFiles.push(file);
        const previewUrl = URL.createObjectURL(file);
        previews.push(previewUrl);
      }
    });

    setMediaFiles((prev) => [...prev, ...validFiles]);
    setMediaPreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveMedia = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(mediaPreviews[index]);
    
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (rating === 0 || !reviewTitle.trim() || !reviewContent.trim()) {
      return;
    }

    // Save rating to global context
    if (vehicleName) {
      setUserRating(vehicleName, rating);
    }

    const newReview: ReviewData = {
      id: `review-${Date.now()}`,
      reviewerName: 'You', // In a real app, this would come from user authentication
      rating,
      title: reviewTitle,
      content: reviewContent,
      vehicleType,
      vehicleModel,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      mediaFiles: mediaFiles.length > 0 ? mediaFiles : undefined
    };

    if (onSubmit) {
      onSubmit(newReview);
    }

    // Reset form
    setRating(0);
    setReviewTitle('');
    setReviewContent('');
    setVehicleType('');
    setVehicleModel('');
    
    // Clean up media previews
    mediaPreviews.forEach((url) => URL.revokeObjectURL(url));
    setMediaFiles([]);
    setMediaPreviews([]);
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="write-review-modal-overlay">
      <div className="write-review-modal">
        {/* Header */}
        <div className="write-review-modal__header">
          <div className="write-review-modal__close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="write-review-modal__content">
          <div className="write-review-modal__main">
            <div className="write-review-modal__title">Add User Review</div>
            
            {/* Vehicle Selection Card */}
            <div className="write-review-modal__vehicle-card">
              <div className="write-review-modal__vehicle-image">
                {vehicleImage ? (
                  <img src={vehicleImage} alt={vehicleName} />
                ) : (
                  <div className="write-review-modal__vehicle-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <path d="M3 12L12 3L21 12L12 21L3 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="write-review-modal__vehicle-info">
                <div className="write-review-modal__vehicle-name">{vehicleName}</div>
                <div className="write-review-modal__change-vehicle">Change Vehicle</div>
              </div>
            </div>

            {/* Rating Section */}
            <div className="write-review-modal__rating-section">
              <div className="write-review-modal__rating-header">
                <span className="write-review-modal__rating-label">Your Rating</span>
                <span className="write-review-modal__rating-value">{rating}/10</span>
              </div>
              <div className="write-review-modal__stars">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    className={`write-review-modal__star ${star <= rating ? 'active' : ''}`}
                    onClick={() => handleRatingClick(star)}
                  >
                    <img 
                      src={star <= rating 
                        ? "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg"
                        : "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b10/starbluenotsolid.svg"
                      }
                      alt="Star" 
                      className="write-review-modal__star-icon"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Form */}
            <div className="write-review-modal__form">
              {/* Review Title */}
              <div className="write-review-modal__field">
                <label className="write-review-modal__field-label">Review Title</label>
                <input
                  type="text"
                  className="write-review-modal__input"
                  placeholder="Give your review a title"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                />
              </div>

              {/* Review Content */}
              <div className="write-review-modal__field">
                <label className="write-review-modal__field-label">Your Review</label>
                <textarea
                  className="write-review-modal__textarea"
                  placeholder="Let others know what you like and dislike based on your hands-on experience with this vehicle"
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            {/* Media Upload Section */}
            <div className="write-review-modal__field">
              <label className="write-review-modal__field-label">Share a video or photo of your car</label>
              <div className="write-review-modal__media-upload">
                <input
                  type="file"
                  id="media-upload"
                  className="write-review-modal__media-input"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleMediaUpload}
                />
                <label htmlFor="media-upload" className="write-review-modal__media-label">
                  <div className="write-review-modal__media-placeholder">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                </label>
                
                {/* Media Previews */}
                {mediaPreviews.length > 0 && (
                  <div className="write-review-modal__media-previews">
                    {mediaPreviews.map((preview, index) => (
                      <div key={index} className="write-review-modal__media-preview">
                        {mediaFiles[index]?.type.startsWith('video/') ? (
                          <video src={preview} controls className="write-review-modal__media-item" />
                        ) : (
                          <img src={preview} alt={`Preview ${index + 1}`} className="write-review-modal__media-item" />
                        )}
                        <button
                          type="button"
                          className="write-review-modal__media-remove"
                          onClick={() => handleRemoveMedia(index)}
                          aria-label="Remove media"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6L18 18"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="write-review-modal__vehicle-details">
              <h3 className="write-review-modal__details-title">Vehicle Details</h3>
              
              <div className="write-review-modal__details-row">
                <div className="write-review-modal__field">
                  <label className="write-review-modal__field-label">Type</label>
                  <select
                    className="write-review-modal__select"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                  >
                    <option value="">Select Type</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="truck">Truck</option>
                    <option value="coupe">Coupe</option>
                    <option value="convertible">Convertible</option>
                  </select>
                </div>

                <div className="write-review-modal__field">
                  <label className="write-review-modal__field-label">Model</label>
                  <select
                    className="write-review-modal__select"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                  >
                    <option value="">Select Trim</option>
                    <option value="base">Base</option>
                    <option value="sport">Sport</option>
                    <option value="luxury">Luxury</option>
                    <option value="performance">Performance</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="write-review-modal__footer">
          <button
            className="write-review-modal__submit-btn"
            onClick={handleSubmit}
            disabled={rating === 0 || !reviewTitle.trim() || !reviewContent.trim()}
          >
            Submit Your Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteReviewModal;
