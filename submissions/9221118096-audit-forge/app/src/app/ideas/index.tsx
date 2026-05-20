import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IDEAS, type Idea } from "@/data/ideas";
import { slopColor, slopLabel } from "@/lib/slop";

function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <Pressable style={styles.card} onPress={() => router.push(`/ideas/${idea.id}`)}>
      <View style={styles.cardHeader}>
        {/* BUG (IdeaListScreen): the title has no flex/numberOfLines and the badge
            has no flexShrink, so a long title shoves the score badge off the right
            edge. Caught by audit report 02. */}
        <Text style={styles.cardTitle}>{idea.title}</Text>
        <View style={[styles.badge, { backgroundColor: slopColor(idea.slopScore) }]}>
          <Text style={styles.badgeScore}>{idea.slopScore}</Text>
          <Text style={styles.badgeLabel}>{slopLabel(idea.slopScore)}</Text>
        </View>
      </View>
      <Text style={styles.cardPitch} numberOfLines={2}>
        {idea.pitch}
      </Text>
    </Pressable>
  );
}

export default function IdeaListScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <FlatList
        data={IDEAS}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <IdeaCard idea={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B1220" },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: "#1E2A44",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2C3E5F",
  },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { color: "#F9FAFB", fontSize: 16, fontWeight: "700" },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignItems: "center" },
  badgeScore: { color: "#0B1220", fontSize: 16, fontWeight: "900" },
  badgeLabel: { color: "#0B1220", fontSize: 8, fontWeight: "800", letterSpacing: 0.5 },
  cardPitch: { color: "#94A3B8", fontSize: 13, marginTop: 8, lineHeight: 18 },
});
