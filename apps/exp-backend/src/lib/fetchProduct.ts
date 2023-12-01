import prisma from "./prisma";

export const fetchProductsForSpecific = async (
  userId: number,
  isAdmin: boolean
) => {
  try {
    const result = isAdmin
      ? await prisma.admin.findUnique({
          where: { id: userId },
          include: {
            cartItems: {
              include: {
                product: true,
              },
            },
          },
        })
      : await prisma.user.findUnique({
          where: { id: userId },
          include: {
            cartItems: {
              include: {
                product: true,
              },
            },
          },
        });

    if (result) {
      const cartItems = result.cartItems || [];
      const products = cartItems.map((cartItem) => cartItem.product);
      return products;
    } else {
      console.log("User or admin not found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching products for user or admin:", error);
    throw error;
  }
};
