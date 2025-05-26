import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TextInput } from "react-native";
import { fetchProducts, fetchCategories } from "@/api/client";
import { Product, Category } from "@/types/api";
import ProductCard from "@/components/ProductCard";
import Colors from "@/constants/colors";
import { Search as SearchIcon } from "lucide-react-native";
import EmptyState from "@/components/EmptyState";

export default function SearchScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
        setFilteredProducts(productsData);
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error("Error loading search data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let result = products;
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== null) {
      result = result.filter(
        (product) => product.category.id === selectedCategory
      );
    }
    
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products]);

  const handleCategoryPress = (categoryId: number) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color={Colors.placeholder} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.placeholder}
        />
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Text
              style={[
                styles.categoryPill,
                selectedCategory === item.id && styles.selectedCategoryPill,
              ]}
              onPress={() => handleCategoryPress(item.id)}
            >
              {item.name}
            </Text>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          message="Try adjusting your search or category filters"
          icon={<SearchIcon size={64} color={Colors.placeholder} />}
        />
      ) : (
        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <ProductCard product={item} />
            </View>
          )}
          contentContainerStyle={styles.productsList}
          columnWrapperStyle={styles.productsRow}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.card,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.card,
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: Colors.text,
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background,
    borderRadius: 20,
    marginRight: 8,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  selectedCategoryPill: {
    backgroundColor: Colors.primary,
    color: Colors.background,
    borderColor: Colors.primary,
  },
  productsList: {
    padding: 16,
  },
  productsRow: {
    justifyContent: "space-between",
  },
  productItem: {
    width: "48%",
    marginBottom: 16,
  },
});