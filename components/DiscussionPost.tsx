import {Ionicons} from "@expo/vector-icons";
import React, {useEffect} from "react";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {TouchableOpacity, View, Text, Image, StyleSheet, Platform, StatusBar, TextInput, FlatList, Alert, Keyboard, ScrollView} from "react-native";
import {useAuth} from "@/config/AuthContext";
import {database} from "@/config/firebaseConfig";
import {onValue, push, ref} from "firebase/database";
import {BackHandler} from 'react-native';


interface Comment {
    id: string,
    author: string,
    content: string
}

interface Discussion {
    id: string,
    title: string,
    author: string,
    content: string,
    likes: number,
    comments: string[],
    image: string
}

const CommentItem: React.FC<{ comment: Comment }> = ({comment}) => {
    return (
        <View style={styles.discussionCard}>
            <Text style={styles.author}>/{comment.author}</Text>
            <Text style={styles.content}>{comment.content}</Text>
        </View>
    );
}

const DiscussionPost: React.FC<{ discussion: Discussion, handleDiscussionPost: () => void }> = ({
                                                                                                    discussion,
                                                                                                    handleDiscussionPost
                                                                                                }) => {
    const [comment, setComment] = React.useState("");
    const [postComments, setPostComments] = React.useState<Comment[]>([]);
    const {user} = useAuth();

    useEffect(() => {
        const commentRef = ref(database, "discussions/" + discussion.id + "/comments");

        // Listen for value changes
        const unsubscribe = onValue(commentRef, (snapshot) => {
            const data = snapshot.val();
            const commentList = [];

            // Transform data into an array
            for (let id in data) {
                commentList.push({id, ...data[id]});
            }

            setPostComments(commentList);
        }, (error) => {
            console.error("Error retrieving discussions:", error);
        });

        return () => unsubscribe();
    }, [database]);

    const handleSubmit = async () => {
        if(!user){
            Alert.alert("You need to be logged in to comment");
            return;
        };
        if(comment.trim()=="") return;
        const newComment = {
            author: user?.email?.split('@')[0] || "unknown",
            content: comment
        }

        try {
            // Push the comment to the discussion's comments array in Firebase
            const commentRef = ref(database, `discussions/${discussion.id}/comments`);
            await push(commentRef, newComment).then(() => {
                Keyboard.dismiss();
            });

            setComment(""); // Clear the input after submission
        } catch (error) {
            console.error("Error submitting comment: ", error);
        }

    }

    useEffect(() => {
        // Function to handle the back press
        const backAction = () => {
            handleDiscussionPost();
            return true; // Returning true overrides the default back action
        };

        // Add event listener for back press
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        // Cleanup the event listener when the component unmounts
        return () => backHandler.remove();
    }, []);


    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#121212"/>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.discussionCard}>
                    <Text style={styles.title}>{discussion.title}</Text>
                    <Text style={styles.author}>/{discussion.author}</Text>
                    {discussion.image && (
                        <Image source={{uri: discussion.image}} style={styles.discussionImage} resizeMode="contain"/>
                    )}
                    <Text style={styles.content}>{discussion.content}</Text>
                    <View style={styles.actions}>
                        <View style={styles.iconRow}>
                            <TouchableOpacity>
                                <Ionicons name="thumbs-up-outline" size={24} color="#ffffff"/>
                                <Text style={styles.likeText}>{discussion.likes}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Ionicons name="thumbs-down-outline" size={24} color="#ff1744"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View>
                    <FlatList
                        data={postComments}
                        renderItem={({item}: { item: Comment }) =>
                            <CommentItem comment={item}/>}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add Comment"
                    placeholderTextColor='white'
                    value={comment}
                    onChangeText={setComment}
                />
                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                    <MaterialCommunityIcons name="send" size={24} color="white"/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Adjust for Android
        paddingHorizontal: 10,
    },
    scrollContainer: {
        marginBottom : 64,
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
        height: undefined,
        aspectRatio: 1,
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
    inputContainer: {
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    input: {
        backgroundColor: "#333", // Dark background for inputs
        color: "white", // White text
        padding: 10,
        borderRadius: 10,
        margin: 10,
        flex: 1,
    },
    submitText: {
        fontSize: 24,
        color: '#0f0',
        fontWeight: 'bold',
    },
    submitBtn: {
        borderRadius: 10,
    },
});

export default DiscussionPost;