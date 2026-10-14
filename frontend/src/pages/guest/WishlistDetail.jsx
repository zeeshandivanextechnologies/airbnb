import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaRegHeart, FaHeart, FaTimes } from "react-icons/fa";
import styles from "../../components/styles/Wishlists.module.css";

const MOCK_WISHLIST = {
  title: "Recently viewed",
  groups: [
    {
      date: "Yesterday",
      items: [
        {
          id: 1,
          title: "Create Lasting Memories in Rome",
          host: "Hosted by Latif",
          image:
            "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        },
        {
          id: 2,
          title: "Cinematic Photography in Jaipur city",
          host: "Hosted by Harsh Vardhan",
          image:
            "https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        },
        {
          id: 3,
          title: "Royal Jaipur Photoshoot",
          host: "Hosted by Ravi Prakash",
          image:
            "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        },
        {
          id: 4,
          title: "Results-oriented fitness",
          host: "Hosted by Amram",
          image:
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        },
      ],
    },
    {
      date: "Saturday, 3 October",
      items: [
        {
          id: 5,
          title: "Rental unit in Gurugram",
          host: "Hosted by Pk",
          image:
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        },
        {
          id: 6,
          title: "Rental unit in Dubai",
          host: "Hosted by Ali",
          image:
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=720&q=80",
        },
      ],
    },
  ],
};

function WishlistDetail() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlistName, setWishlistName] = useState("");
  const [data, setData] = useState(MOCK_WISHLIST);
  const [savedItemIds, setSavedItemIds] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const removeItem = (groupIdx, itemId) => {
    const newData = { ...data };
    newData.groups[groupIdx].items = newData.groups[groupIdx].items.filter(
      (item) => item.id !== itemId,
    );
    setData(newData);
  };

  return (
    <div className={`container-fluid ${styles.pageContainer}`}>
      <div className={styles.detailHeader}>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/wishlists")}
        >
          <FaChevronLeft />
        </button>
        <button
          className={styles.editBtn}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Done" : "Edit"}
        </button>
      </div>

      <h1 className={styles.pageTitle}>{data.title}</h1>

      {data.groups.map((group, groupIdx) => (
        <div key={group.date}>
          {group.items.length > 0 && (
            <h2 className={styles.dateTitle}>{group.date}</h2>
          )}
          <div className="row">
            {group.items.map((item) => (
              <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className={styles.listingCard}>
                  <div className={styles.listingImageWrapper}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className={styles.listingImg}
                    />

                    {isEditing ? (
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeItem(groupIdx, item.id)}
                      >
                        <FaTimes />
                      </button>
                    ) : (
                      <button
                        className={styles.heartBtn}
                        onClick={() => {
                          setSelectedItemId(item.id);
                          setIsModalOpen(true);
                        }}
                      >
                        {savedItemIds.includes(item.id) ? (
                          <FaHeart style={{ color: '#e51d53' }} />
                        ) : (
                          <FaRegHeart />
                        )}
                      </button>
                    )}
                  </div>
                  <h3 className={styles.listingTitle}>{item.title}</h3>
                  <p className={styles.listingHost}>{item.host}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div style={{ width: "24px" }}></div>
              <h2>Create wishlist</h2>
              <button
                className={styles.closeModalBtn}
                onClick={() => setIsModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className={styles.modalBody}>
              <input
                type="text"
                placeholder="Name"
                className={styles.inputField}
                value={wishlistName}
                onChange={(e) => setWishlistName(e.target.value)}
                maxLength={50}
              />
              <div className={styles.charCount}>
                {wishlistName.length}/50 characters
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={styles.createBtn}
                disabled={!wishlistName.trim()}
                onClick={() => {
                  if (selectedItemId && !savedItemIds.includes(selectedItemId)) {
                    setSavedItemIds([...savedItemIds, selectedItemId]);
                  }
                  setIsModalOpen(false);
                  setWishlistName("");
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WishlistDetail;
