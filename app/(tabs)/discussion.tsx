import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity, FlatList, StatusBar, Platform, Alert} from "react-native";
import {Ionicons} from '@expo/vector-icons';
import DiscussionForm from "@/components/DiscussionForm";
import {database} from "@/config/firebaseConfig";
import {ref, onValue, update} from "@firebase/database";
import {useAuth} from "@/config/AuthContext";
import DiscussionPost from "@/components/DiscussionPost";
import { remove } from "firebase/database";
import { Picker } from "@react-native-picker/picker";
import UpdatePage from "@/components/UpdateDiscussion";

interface Discussion {
    id: string,
    title: string,
    author: string,
    content: string,
    likes: number,
    comments: string[],
    image: string,
    category: string
}

const DiscussionItem: React.FC<{
    discussion: Discussion,
    handleDiscussionPost: () => void,
    handleSelectedDiscussion: (discussion: Discussion) => void
    handleUpdatePage: (discussion: Discussion) => void
}> = ({discussion, handleDiscussionPost, handleSelectedDiscussion, handleUpdatePage}) => {

    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [likes, setLikes] = useState(discussion.likes);

    const {user, authenticating} = useAuth();

    const handleLikes = () => {
        const discussionRef = ref(database, `discussions/${discussion.id}`);
        if (user) {
            if (liked) {
                // If the post is already liked, undo the like
                setLikes(likes - 1);
                setLiked(false);
                update(discussionRef, {likes: likes - 1});
            } else {
                // If the post is not liked yet, increment the like
                setLikes(likes + 1);
                setLiked(true);
                if (disliked) {
                    // If the user has disliked, we also remove that dislike
                    setLikes(likes + 1);
                    setDisliked(false);
                    update(discussionRef, {likes: likes + 1});
                } else {
                    update(discussionRef, {likes: likes + 1});
                }
            }
        }
    };

    const handleDislikes = () => {
        const discussionRef = ref(database, `discussions/${discussion.id}`);
        if (user) {
            if (disliked) {
                // If the post is already disliked, undo the dislike
                setLikes(likes + 1);
                setDisliked(false);
                update(discussionRef, {likes: likes + 1});
            } else {
                // If the post is not disliked yet, increment the dislike
                setLikes(likes - 1);
                setDisliked(true);
                if (liked) {
                    // If the user has liked, we also remove that like
                    setLikes(likes - 1);
                    setLiked(false);
                    update(discussionRef, {likes: likes - 1});
                } else {
                    update(discussionRef, {likes: likes - 1});
                }
            }
        }
    };

    const handleTap = () => {
        handleSelectedDiscussion(discussion);
        handleDiscussionPost();
    }

    const deleteDiscussion = async () => {
        const discussionRef = ref(database, `discussions/${discussion.id}`);
        try {
            await remove(discussionRef); // Remove the discussion from Firebase
            Alert.alert('Deleted', 'The discussion has been deleted.');
        } catch (error) {
            console.error('Error deleting discussion:', error);
        }
    };

    const handleLongPress = () => {
        // Check if the current user is the author
        if (user?.email?.split('@')[0] === discussion.author) {
            // Alert.alert(
            //     "Delete Post",
            //     "Are you sure you want to delete this post?",
            //     [
            //         {
            //             text: "Cancel",
            //             style: "cancel",
            //         },
            //         {
            //             text: "Delete",
            //             onPress: () => deleteDiscussion(),
            //             style: "destructive", // Red button for destructive action
            //         },
            //     ],
            //     {cancelable: true}
            // );
            Alert.alert(
                "Options",
                "Choose an action",
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "Delete",
                        onPress: () => deleteDiscussion(),
                        style: "destructive", // Red button for destructive action
                    },
                    {
                        text: "Update",
                        onPress: () => {
                            // Navigate to the update page or handle the update logic here
                            handleUpdatePage(discussion);
                        }
                    },
                ],
                { cancelable: true }
            );
        }
    };

    return (
        <TouchableOpacity onPress={handleTap} onLongPress={handleLongPress}>
            <View style={styles.discussionCard}>
                <Text style={styles.title}>{discussion.title}</Text>
                <Text style={styles.author}>/{discussion.author}</Text>
                {discussion.image && (
                    <Image source={{uri: discussion.image}} style={styles.discussionImage}/>
                )}
                {(!discussion.image && discussion.content) && <Text style={styles.content} numberOfLines={5} ellipsizeMode="tail">{discussion.content}</Text>}
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
                    <TouchableOpacity style={styles.commentButton} onPress={handleTap}>
                        <Ionicons name="chatbubble-outline" size={24} color="#ffffff"/>
                        <Text style={styles.commentButtonText}>Comment</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const DiscussionScreen: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [showPost, setShowPost] = useState(false);
    const [selectedDiscussion, setSelectedDiscussion] = useState({} as Discussion);
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const {user, authenticating} = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [filteredDiscussions, setFilteredDiscussions] = useState<Discussion[]>([]);

    const [showUpdatePage, setShowUpdatePage] = useState(false);

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
        }, (error) => {
            console.error("Error retrieving discussions:", error);
        });

        return () => unsubscribe();
    }, [database]);

    useEffect(() => {
        if (selectedCategory === "All" || selectedCategory === '') {
            setFilteredDiscussions(discussions);
        }else if(selectedCategory === 'myPosts'){
            setFilteredDiscussions(discussions.filter(discussion => discussion.author === user?.email?.split('@')[0]));
        }
        else {
            setFilteredDiscussions(discussions.filter(discussion => discussion.category === selectedCategory));
        }
    }, [selectedCategory, discussions]);

    const handleDiscussionForm = () => {
        setShowForm(!showForm);
    };

    const handleDiscussionPost = () => {
        setShowPost(!showPost);
    };

    const handleSelectedDiscussion = (discussion: Discussion) => {
        setSelectedDiscussion(discussion);
    }

    const handleUpdatePage = (discussion: Discussion) => {
        setSelectedDiscussion(discussion);
        setShowUpdatePage(true); // Show the update page
    };

    return (
        <>
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#121212"/>

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedCategory}
                        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="All" value="All" />
                        <Picker.Item label="Water Quality" value="Water Quality" />
                        <Picker.Item label="Sanitation" value="Sanitation" />
                        <Picker.Item label="Education" value="Education" />
                        <Picker.Item label="Climate" value="Climate" />
                        <Picker.Item label="Health" value="Health" />
                        <Picker.Item label="Q&A" value="Q&A" />
                        <Picker.Item label="Other" value="Other" />
                        {user && <Picker.Item label="My Posts" value="myPosts" />}
                    </Picker>
                </View>

                <FlatList
                    data={filteredDiscussions}
                    renderItem={({item}: { item: Discussion }) =>
                        <DiscussionItem discussion={item}
                                        handleDiscussionPost={handleDiscussionPost}
                                        handleSelectedDiscussion={handleSelectedDiscussion}
                                        handleUpdatePage={handleUpdatePage}
                        />}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.discussionList}
                />
                {user && <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={handleDiscussionForm}
                >
                    <Ionicons name="add" size={32} color="white"/>
                </TouchableOpacity>}
            </View>
            {showForm && (
                <View style={styles.formContainer}>
                    <DiscussionForm closeDiscussionForm={handleDiscussionForm}/>
                </View>
            )}
            {showPost && (
                <View style={styles.postContainer}>
                    <DiscussionPost discussion={selectedDiscussion} handleDiscussionPost={handleDiscussionPost}/>
                </View>
            )}
            {showUpdatePage && (
                <View style={styles.formContainer}>
                    <UpdatePage discussion={selectedDiscussion} closeUpdatePage={() => setShowUpdatePage(false)} />
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
        height: 200,
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
        width: '20%',
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
    postContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000', // Optional: add a semi-transparent background
        zIndex: 10,
    },

    pickerContainer: {
        backgroundColor: "#1E1E1E",
        borderRadius: 10,
        marginBottom: 15,
    },
    picker: {
        color: "white", // White text for dropdown
    },
});

export default DiscussionScreen;

