import React, {useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, StatusBar, Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DiscussionForm from "@/components/DiscussionForm";
import { database } from "@/config/firebaseConfig";
import { DatabaseReference, push, ref, onValue, update} from "@firebase/database";

interface Discussion {
    id: string,
    title: string,
    author: string,
    content: string,
    likes: number,
    comments: number,
    image: string // No image for this discussion
}

const DiscussionItem: React.FC<{ discussion: Discussion }> = ({discussion}) => {

    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [likes, setLikes] = useState(discussion.likes);

    const handleLikes = () => {
        const discussionRef = ref(database, `discussions/${discussion.id}`);

        if (liked) {
            // If the post is already liked, undo the like
            setLikes(likes - 1);
            setLiked(false);
            update(discussionRef, { likes: likes - 1 });
        } else {
            // If the post is not liked yet, increment the like
            setLikes(likes + 1);
            setLiked(true);
            if (disliked) {
                // If the user has disliked, we also remove that dislike
                setLikes(likes + 1);
                setDisliked(false);
                update(discussionRef, { likes: likes + 1});
            } else {
                update(discussionRef, { likes: likes + 1 });
            }
        }
    };

    const handleDislikes = () => {
        const discussionRef = ref(database, `discussions/${discussion.id}`);

        if (disliked) {
            // If the post is already disliked, undo the dislike
            setLikes(likes + 1);
            setDisliked(false);
            update(discussionRef, { likes: likes + 1});
        } else {
            // If the post is not disliked yet, increment the dislike
            setLikes(likes - 1);
            setDisliked(true);
            if (liked) {
                // If the user has liked, we also remove that like
                setLikes(likes - 1);
                setLiked(false);
                update(discussionRef, { likes: likes - 1});
            } else {
                update(discussionRef, { likes: likes - 1});
            }
        }
    };

    return (
        <View style={styles.discussionCard}>
            <Text style={styles.title}>{discussion.title}</Text>
            <Text style={styles.author}>/{discussion.author}</Text>
            {discussion.image && (
                <Image source={{uri: discussion.image}} style={styles.discussionImage}/>
            )}
            <Text style={styles.content}>{discussion.content}</Text>
            <View style={styles.actions}>
                <View style={styles.iconRow}>
                    <TouchableOpacity onPress={handleLikes}>
                        <Ionicons name="thumbs-up-outline" size={24} color="#ffffff"/>
                        <Text style={styles.likeText}>{discussion.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDislikes}>
                        <Ionicons name="thumbs-down-outline" size={24} color="#ff1744"/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.commentButton}>
                    <Ionicons name="chatbubble-outline" size={24} color="#ffffff"/>
                    <Text style={styles.commentButtonText}>Comment</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const DiscussionScreen: React.FC = () => {
    const renderItem = ({item}: { item: Discussion }) => <DiscussionItem discussion={item}/>;
    const navigation = useNavigation();
    const [showForm, setShowForm] = useState(false);

    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const discussionsRef = ref(database, "discussions");

        // Listen for value changes
        const unsubscribe = onValue(discussionsRef, (snapshot) => {
            const data = snapshot.val();
            const discussionList = [];

            // Transform data into an array
            for (let id in data) {
                discussionList.push({id, ...data[id]});
            }

            setDiscussions(discussionList);
            setLoading(false);
        }, (error) => {
            console.error("Error retrieving discussions:", error);
            setLoading(false);
        });

        // Clean up the listener on unmount
        return () => unsubscribe();
    }, [database]);

    const handleDiscussionForm = () => {
        setShowForm(!showForm);
    };

    return (
        <>
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#121212"/>
                <FlatList
                    data={discussions}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.discussionList}
                />
                {/* Floating button for adding new discussions */}
                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={handleDiscussionForm}
                >
                    <Ionicons name="add" size={32} color="white"/>
                </TouchableOpacity>
            </View>
            {showForm && (
                <View style={styles.formContainer}>
                    <DiscussionForm closeDiscussionForm={handleDiscussionForm}/>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Adjust for Android
        paddingHorizontal: 10,
    },
    discussionList: {
        paddingBottom: 80, // So that content is not hidden behind the floating button
    },
    discussionCard: {
        backgroundColor: "#1E1E1E",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 5,
    },
    author: {
        fontSize: 14,
        color: "#ffffff",
        marginBottom: 10,
    },
    content: {
        fontSize: 16,
        color: "#ffffff",
        marginBottom: 10,
    },
    discussionImage: {
        width: "100%",
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    iconRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        //backgroundColor: "#333",
        width:'20%',
    },
    likeText: {
        color: "#ffffff",
    },
    commentButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#6200EA",
        borderRadius: 5,
        padding: 5,
        paddingHorizontal: 10,
    },
    commentButtonText: {
        color: "#ffffff",
        marginLeft: 5,
    },
    floatingButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#6200EA",
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    formContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Optional: add a semi-transparent background
        zIndex: 10,
    },
});

export default DiscussionScreen;

