import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dummyData } from './constants/dummyData';
import { dummyData2 } from './constants/dummyData2';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { dummyData3 } from './constants/dummyData3';

// Simple circular avatar component using initials
const Avatar = ({ initials, size = 40 }) => (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={styles.avatarText}>{initials}</Text>
    </View>
);

const initialMessages = [
    {
        id: '1',
        type: 'bot',
        content:
            "👋 Hi there! Welcome to DBS Delivery. I'm your virtual assistant — here to make your experience quick and easy. How can I help you today?",
        bubbleType: 'hero',
    },
];


const menuOptions = dummyData3.map((item) => item.category);
const recentFaqs = dummyData2.map((item) => item.category);
export default function Chatbot() {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [selectedMenu, setSelectedMenu] = useState(null);

    // Bottom sheet states
    const SHEET_HEIGHT = Math.round(Math.min(480, Dimensions.get('window').height * 0.55));
    const sheetAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current; // animates translateY from SHEET_HEIGHT -> 0
    const [isSheetMounted, setIsSheetMounted] = useState(false); // controls whether overlay is rendered

    // FlatList ref so we can keep it scrolled to bottom as messages change
    const listRef = useRef(null);

    useEffect(() => {
        // scroll to bottom when new messages arrive
        if (listRef.current) {
            try {
                listRef.current.scrollToEnd({ animated: true });
            } catch (e) {
                // some RN versions warn; ignore gracefully
            }
        }
    }, [messages]);


    const openMenu = () => {
        // mount the overlay first, then slide up
        setIsSheetMounted(true);
        // ensure starting pos
        sheetAnim.setValue(SHEET_HEIGHT);
        Animated.timing(sheetAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeMenu = () => {
        // slide down then unmount overlay
        Animated.timing(sheetAnim, {
            toValue: SHEET_HEIGHT,
            duration: 220,
            useNativeDriver: true,
        }).start(() => setIsSheetMounted(false));
    };

    function handleMenu(index) {
        setSelectedMenu(index);
        closeMenu();
        // onQuickPress("", true);
        // console.log(index);
        const obj = dummyData3.filter((item, ind) => ind === index);
        console.log(obj[0].category);
        const selectedOption = obj[0].category
        const userMsg = { id: String(Math.random()), type: 'user', content: selectedOption };
        setMessages((m) => [...m, userMsg]);
        // console.log(obj[0].sub_queries);
        const questions = obj[0].sub_queries.map((item) => item.question);
        // console.log(questions);
        onQuickPress(questions, index);
    }
    function handleRecentFaqs(index) {
        // console.log(index);
        const obj = dummyData3.filter((item, ind) => ind === index);
        const questions = obj[0].sub_queries.map((item) => item.question);
        const userSelection = obj[0].category;
        const userMsg = { id: String(Math.random()), type: 'user', content: userSelection };
        setMessages((m) => [...m, userMsg]);
        onQuickPress(questions, index);
    }
    function handleAnswers(index, parentId) {
        // console.log(index, parentId);
        // console.log(dummyData[parentId].sub_queries[index])
        const answer = dummyData3[parentId].sub_queries[index].answer;
        const userSelectedOption = dummyData3[parentId].sub_queries[index].question;
        // console.log(userSelectedOption);
        const userMsg = { id: String(Math.random()), type: 'user', content: userSelectedOption };
        setMessages((m) => [...m, userMsg]);
        setMessages((m) => [
            ...m,
            { id: String(Math.random()), type: 'bot', isQuestions: false, content: answer, },
        ])

    }
    const onQuickPress = (label, parentId) => {
        // console.log(label.map((item) => item))
        setMessages((m) => [
            ...m,
            { id: String(Math.random()), type: 'bot', isQuestions: true, content: label.map((item) => item), parentId, },
        ]);


        // if (isMenu) {
        //     setMessages((m) => [
        //         ...m,
        //         { id: String(Math.random()), type: 'bot', isQuestions: true, content: `${label.map((item) => item)}` },
        //     ]);
        // }
        // else {

        //     const userMsg = { id: String(Math.random()), type: 'user', content: label };
        //     setMessages((m) => [...m, userMsg]);
        //     setTimeout(() => {
        //         setMessages((m) => [
        //             ...m,
        //             { id: String(Math.random()), type: 'bot', content: `You selected: ${label}. (This is a dummy response)` },
        //         ]);
        //     }, 700);
        // };
    }


    const  sendMessage = () => {
        if (!input.trim()) return;
        const userMsg = { id: String(Math.random()), type: 'user', content: input };
        setMessages((m) => [...m, userMsg]);
        setInput('');

        setTimeout(() => {
            setMessages((m) => [
                ...m,
                { id: String(Math.random()), type: 'bot', content: `Thanks — you said: "${userMsg.content}".` },
            ]);
        }, 700);
    };

    const renderMessage = ({ item }) => {
        if (item.type === "bot" && !item.isQuestions) {
            <View style={[styles.row, true ? { justifyContent: 'flex-start' } : { justifyContent: 'flex-end' }]}>
                {<Avatar initials={'AI'} />}
                <View style={[styles.msgBubble, true ? styles.botBubble : styles.userBubble]}>
                    <Text style={true ? styles.botText : styles.userText}>{item.content}</Text>
                </View>
                {!true && <Avatar initials={'SJ'} />}
            </View>


        }
        if (item.type === "bot" && item.isQuestions) {
            return (<View style={{ flexDirection: 'row', alignItems: 'flex-end', borderBottomLeftRadius: 0 }}>
                <Avatar initials={'AI'} />

                <View style={[styles.heroContainer, { flexDirection: "row", flexWrap: "wrap" }]}>

                    {item.content.map((i, index) => {
                        return (
                            <View key={index} style={styles.quickRow}>
                                <TouchableOpacity style={styles.pill} onPress={() => {
                                    handleAnswers(index, item.parentId)
                                }}>
                                    <Text style={styles.pillText}>{i}</Text>
                                </TouchableOpacity>
                            </View>

                        );
                    })}
                     <TouchableOpacity style={styles.pill} onPress={openMenu}>
                            <Text style={styles.pillText}>👈🏻 Return to MENU</Text>
                        </TouchableOpacity>
                </View>
            </View>);
        }

        if (item.bubbleType === 'hero') {
            return (
                <View style={{ display: "flex", flexDirection: "row", alignItems: "flex-end" }}>
                    <Avatar initials={'AI'} />

                    <View style={styles.heroContainer}>
                        <Text style={styles.heroText}>{item.content}</Text>
                        {recentFaqs.map((item, index) => {
                            return (
                                <View key={index} style={styles.quickRow}>
                                    <TouchableOpacity style={styles.pill} onPress={() => {
                                        handleRecentFaqs(index)
                                    }}>
                                        <Text style={styles.pillText}>{item}</Text>
                                        <Ionicons name="arrow-forward-circle-sharp" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                        <TouchableOpacity style={styles.pill} onPress={() => {
                            alert('Navigates to Agent')
                        }}>
                            <Text style={styles.pillText}>{'💬 Talk to Agent'}</Text>
                            <Ionicons name="arrow-forward-circle-sharp" size={24} color="black" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuBtn} onPress={openMenu}>
                            <Text style={styles.menuBtnText}>☰ MENU</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        const isBot = item.type === 'bot';
        return (
            <View style={[styles.row, isBot ? { justifyContent: 'flex-start' } : { justifyContent: 'flex-end' }]}>
                {isBot && <Avatar initials={'AI'} />}
                <View style={[styles.msgBubble, isBot ? styles.botBubble : styles.userBubble]}>
                    <Text style={isBot ? styles.botText : styles.userText}>{item.content}</Text>
                </View>
                {!isBot && <Avatar initials={'SJ'} />}
            </View>
        );
    };

    // translateY for sheet
    const sheetStyle = { transform: [{ translateY: sheetAnim }] };

    return (
        
            <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS==='ios'?80:0}>
                
                <View style={styles.header}>
                    <TouchableOpacity >
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>AI Assistant</Text>
                        <Text style={styles.onlineText}>Online</Text>
                    </View>
                    <View style={{ width: 32 }} />
                </View>

                <FlatList
                    ref={listRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={{ padding: 16, paddingBottom: 20 ,marginLeft:-10}}
                    // avoids extra space when there are few items
                    ListFooterComponent={<View style={{ height: 6 }} />}
                />

                <View style={[styles.inputRow]}>
                    <TouchableOpacity style={{ marginRight: 8 }} onPress={() => { }}>
                        <Avatar initials={'MJ'} size={36} />
                    </TouchableOpacity>
                    

                        <TextInput
                            placeholder="Type the message..."
                            value={input}
                            onChangeText={setInput}
                            style={styles.input}
                            onSubmitEditing={sendMessage}
                            returnKeyType="send"
                            editable={false}
                            blurOnSubmit={false}
                        />
                    


                    <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                        <Feather name="send" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                
            {/* Bottom sheet implemented as an absolutely positioned overlay (no RN <Modal/>). */}
            {isSheetMounted && (
                <View style={styles.overlayContainer} pointerEvents="box-none">
                    {/* dim background - touch to close */}
                    <TouchableWithoutFeedback onPress={closeMenu}>
                        <View style={styles.overlayDim} />
                    </TouchableWithoutFeedback>

                    <View style={styles.modalHandle} />
                    <Animated.View style={[styles.sheetContainer, { height: SHEET_HEIGHT }, sheetStyle]}>

                        <FlatList
                            data={menuOptions}
                            keyExtractor={(i, idx) => String(idx)}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    onPress={() => { handleMenu(index) }}
                                    style={styles.modalRow}
                                >
                                    <Text style={styles.modalText}>{item}</Text>
                                    <View style={styles.radioOuter}>{selectedMenu === index && <View style={styles.radioInner} />}</View>
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            style={{ width: '100%' }}
                        />

                    </Animated.View>
                </View >
            )
            }
        
            </KeyboardAvoidingView>

    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff',marginVertical:30},
    header: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },

    headerTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
    onlineText: { fontSize: 12, color: '#1db954', textAlign: 'center' },

    heroContainer: {
        backgroundColor: '#CFAFF6', // purple tone similar to image
        borderRadius: 20,
        borderBottomLeftRadius: 0,
        padding: 4,
        paddingHorizontal: 8,
        marginBottom: 10,
        // flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",

        marginRight: 65,
    },
    heroText: { fontSize: 16, color: '#111', marginBottom: 12 },
    quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    quickRowCenter: { alignItems: 'center', marginBottom: 10 },
    pill: { backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 18, minWidth: 150, alignItems: 'center',flexDirection:'row', elevation: 2 },
    pillText: { fontSize: 14, color: '#222' },
    pillCenter: { backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, minWidth: 220, alignItems: 'center' },
    pillTextCenter: { fontSize: 15, color: '#222' },
    menuBtn: { backgroundColor: '#fff', padding: 12, borderWidth: 1, borderRadius: 28, alignItems: 'center', marginVertical: 6, alignSelf: 'center', width: 220 },
    menuBtnText: { fontWeight: '700' },
    

    row: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 8 },
    msgBubble: { maxWidth: '70%', padding: 12, borderRadius: 14 },
    botBubble: { backgroundColor: '#CFAFF6', marginLeft: 2, borderTopLeftRadius: 6 },
    userBubble: { backgroundColor: '#d9d9d9', marginRight: 2, borderTopRightRadius: 6 },
    botText: { color: '#111' },
    userText: { color: '#111' },

    avatar: { backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ddd' ,marginRight:2},
    avatarText: { fontWeight: '700' },

    inputRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 12,paddingHorizontal:12,marginBottom:7, borderTopWidth: 1, borderTopColor: '#eee' },
    input: { flex: 1, backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 30, borderWidth: 1, borderColor: '#eee' },
    sendBtn: { marginLeft: 8, backgroundColor: '#fff', borderRadius: 24, padding: 10, borderWidth: 1, borderColor: '#eee' },

    // overlay & sheet
    overlayContainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'flex-end', zIndex: 1000 },
    overlayDim: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.25)' },
    sheetContainer: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#f2f2f2', borderTopLeftRadius: 18, borderTopRightRadius: 18, alignItems: 'center', paddingTop: 12, overflow: 'hidden' },
    modalHandle: { width: 40, height: 6, backgroundColor: '#ddd', borderRadius: 6, marginBottom: 8 },
    modalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 18, width: '100%', backgroundColor: '#fff' },
    modalText: { fontSize: 16 },
    radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#333', alignItems: 'center', justifyContent: 'center' },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#333' },
});
