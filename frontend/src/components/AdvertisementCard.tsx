import type { Listing } from "@/services/api/listings";
import type { ListingStatus } from "./ListingsGrid";
import { Box, Button, Image, Text } from "@chakra-ui/react";

interface Props {
  listing: Listing;
  status: ListingStatus;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onActivate?: (id: number) => void;
}

export default function AdvertisementCard({
  listing,
  status,
  onEdit,
  onDelete,
  onActivate,
}: Props) {
  const mainPhoto = listing.photos?.find((p) => p.is_main);
  const imageUrl = mainPhoto
    ? `/api/photos/${mainPhoto.photo_id}`
    : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <Box className="flex flex-col bg-white rounded-md shadow p-4 w-full">
      <div className="flex gap-4">
        <Image
          src={imageUrl}
          alt={listing.title}
          className="w-[200px] h-[150px] object-cover rounded bg-gray-100"
        />

        <div className="flex flex-col justify-between flex-1">
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              {listing.title}
            </Text>

            <Text fontSize="sm" color="gray.600">
              Тип: {listing.type}
            </Text>

            <Text fontSize="sm" color="gray.600">
              Контейнер: {listing.container_type}
            </Text>

            <Text fontSize="sm" color="gray.600">
              Локація: {listing.location}
            </Text>

            <Text fontSize="sm" color="gray.500">
              Дата: {new Date(listing.addition_date).toLocaleDateString()}
            </Text>
          </Box>

          <Text fontSize="xl" fontWeight="bold" textAlign="right">
            {listing.price} {listing.currency ?? "USD"}
          </Text>
        </div>
      </div>

      <Box className="flex gap-4 text-gray-500 text-sm mt-2">
        <span>👁 {listing.analytics?.views ?? 0}</span>
        <span>⭐ {listing.analytics?.favorites ?? 0}</span>
        <span>📞 {listing.analytics?.phone_views ?? 0}</span>
      </Box>

      <div className="border-t my-3" />

      <div className="flex gap-3">
        {(status === "active" || status === "rejected") && (
          <Button
            bg="gray.700"
            color="white"
            onClick={() => onEdit?.(listing.id)}
          >
            Редагувати
          </Button>
        )}

        {status === "inactive" && (
          <Button
            bg="green.600"
            color="white"
            onClick={() => onActivate?.(listing.id)}
          >
            Активувати
          </Button>
        )}

        <Button
          colorScheme="red"
          variant="outline"
          onClick={() => onDelete?.(listing.id)}
        >
          Видалити
        </Button>
      </div>
    </Box>
  );
}
