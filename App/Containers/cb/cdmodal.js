const [showScoreModal, setShowScoreModal] = useState(false);

<Modal
animationType="slide"
transparent={true}
visible={showScoreModal}
>
    <View style={{
        flex: 1,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <View style={{
            backgroundColor: COLORS.white,
            width: '90%',
            borderRadius: 20,
            padding: 20,
            alignItems: 'center'
        }}>
            <Text style={{fontSize: 30, fontWeight: 'bold'}}>{ score> (allQuestions.length/2) ? 'Congratulations!' : 'Oops!' }</Text>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginVertical: 20
            }}>
                <Text style={{
                    fontSize: 30,
                    color: score> (allQuestions.length/2) ? COLORS.success : COLORS.error
                }}>{score}</Text>
                 <Text style={{
                     fontSize: 20, color: COLORS.black
                 }}>/ { allQuestions.length }</Text>
            </View>
            {/* Retry Quiz button */}
            <TouchableOpacity
            onPress={restartQuiz}
            style={{
                backgroundColor: COLORS.accent,
                padding: 20, width: '100%', borderRadius: 20
            }}>
                <Text style={{
                    textAlign: 'center', color: COLORS.white, fontSize: 20
                }}>Retry Quiz</Text>
            </TouchableOpacity>

        </View>
    </View>
</Modal>
