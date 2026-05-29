import { headers } from "next/headers";
import { getApiUrl } from "@/lib/utils";
// import { fetchWordPressPosts } from "@/lib/wordpress";

// Force dynamic rendering to ensure fresh data on each request
export const dynamic = "force-dynamic";

// Static routes with their metadata for Kevasiya website
const staticRoutes = [
  {
    url: "/",
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: "/about",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: "/contact",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: "/privacy-policy",
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: "/terms-conditions",
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  // Main category pages
  {
    url: "/baby",
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: "/wedding",
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: "/corporates",
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: "/festival",
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  // Collections pages
  {
    url: "/collections",
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  // Blog pages
  // {
  //   url: "/blog",
  //   lastModified: new Date(),
  //   changeFrequency: "daily",
  //   priority: 0.9,
  // },
];

// Fetch categories from API
async function fetchCategories() {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/categories`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error("Failed to fetch categories:", response.status);
      return [];
    }

    const categories = await response.json();
    return categories.filter((category) => category.slug && category.name);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Fetch subcategories for a specific category
async function fetchSubcategories(categoryId) {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(
      `${apiUrl}/subcategories?category_id=${categoryId}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch subcategories:", response.status);
      return [];
    }

    const subcategories = await response.json();
    return subcategories.filter(
      (subcategory) => subcategory.slug && subcategory.name
    );
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
}

// Generate collection routes dynamically from API
async function generateCollectionRoutes() {
  const routes = [];

  try {
    // Fetch all categories
    const categories = await fetchCategories();

    for (const category of categories) {
      // Add category route
      routes.push({
        url: `/collections/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });

      // Fetch subcategories for this category
      const subcategories = await fetchSubcategories(category.id);

      // Add subcategory routes
      for (const subcategory of subcategories) {
        routes.push({
          url: `/collections/${category.slug}/${subcategory.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch (error) {
    console.error("Error generating collection routes:", error);
  }

  return routes;
}

// Fetch products from API
async function fetchProducts() {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/products`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error("Failed to fetch products:", response.status);
      return [];
    }

    const products = await response.json();
    return products.filter((product) => product.slug && product.name);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Function to generate product routes
async function generateProductRoutes() {
  try {
    const products = await fetchProducts();

    return products.map((product) => ({
      url: `/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Error generating product routes:", error);
    return [];
  }
}

// Function to generate blog routes from WordPress
// async function generateBlogRoutes() {
//   try {
//     // Fetch all blog posts from WordPress (we'll fetch in batches to get all posts)
//     let allPosts = [];
//     let page = 1;
//     let hasMore = true;
    
//     while (hasMore) {
//       const { posts, totalPages } = await fetchWordPressPosts(page, 100); // Fetch 100 posts per page
//       allPosts = [...allPosts, ...posts];
      
//       hasMore = page < totalPages;
//       page++;
      
//       // Safety break to prevent infinite loops
//       if (page > 50) {
//         console.warn("Reached maximum page limit for blog posts");
//         break;
//       }
//     }

//     return allPosts.map((post) => ({
//       url: `/${post.slug}`,
//       lastModified: new Date(post.modified),
//       changeFrequency: "weekly",
//       priority: 0.7,
//     }));
//   } catch (error) {
//     console.error("Error generating blog routes:", error);
//     return [];
//   }
// }

export default async function sitemap() {
  const headersList = await headers();
  const domain = headersList.get("host") || "kevasiya.com";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${domain}`;

  // Generate collection routes dynamically from API
  const collectionRoutes = await generateCollectionRoutes();

  // Generate product routes
  const productRoutes = await generateProductRoutes();

  // Generate blog routes from WordPress
  // const blogRoutes = await generateBlogRoutes();

  // Combine all routes
  const allRoutes = [...staticRoutes, ...collectionRoutes, ...productRoutes];

  // Add base URL to all routes
  return allRoutes.map((route) => ({
    ...route,
    url: `${baseUrl}${route.url}`,
  }));
}
