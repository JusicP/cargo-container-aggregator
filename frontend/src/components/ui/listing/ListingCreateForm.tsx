import { useMemo, useRef, useState } from "react";
import {
    Box,
    Button,
    Field,
    Flex,
    Image,
    Input,
    NativeSelect,
    Stack,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import DOMPurify from "dompurify";

import {
    conditionMap,
    containerDimensions,
    containerTypes,
    listingCreateSchema,
    listingTypes,
    ralColors,
    type ListingCreateFormValues,
} from "@/schemas/listingSchema";
import { useCreateListing, type ListingCreate } from "@/services/api/listings";
import { privateAxiosInstance } from "@/services/axiosInstances";

type UploadedPhoto = {
    photoId: number;
    url: string;
    isMain: boolean;
};

const ensureMainPhoto = (items: UploadedPhoto[]) => {
    if (!items.length) return items;
    if (items.some((photo) => photo.isMain)) return items;

    const [first, ...rest] = items;
    return [{ ...first, isMain: true }, ...rest];
};

export default function ListingCreateForm() {
    const createListing = useCreateListing();
    const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const defaultValues = useMemo<Partial<ListingCreateFormValues>>(
        () => ({
            title: "",
            description: "",
            price: 0,
            container_type: Object.keys(containerTypes)[0] ?? "",
            condition: Object.keys(conditionMap)[0] ?? "",
            type: Object.keys(listingTypes)[0] ?? "",
            currency: Intl.supportedValuesOf("currency")[0],
            location: "",
            ral_color: Object.keys(ralColors)[0] ?? "",
            dimension: Object.keys(containerDimensions)[0] ?? "",
        }),
        []
    );

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        reset,
        setFocus,
    } = useForm<ListingCreateFormValues>({
        resolver: zodResolver(listingCreateSchema),
        defaultValues,
        mode: "onSubmit",
        reValidateMode: "onChange",
    });

    const sanitizeAll = (data: Record<string, unknown>) =>
        Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key,
                typeof value === "string" ? DOMPurify.sanitize(value) : value,
            ])
        );

    const onSubmit = async (formValues: ListingCreateFormValues) => {
        try {
            setFormError(null);
            const sanitizedData = sanitizeAll(formValues) as ListingCreateFormValues;
            const payload: ListingCreate = {
                ...sanitizedData,
                price: sanitizedData.price,
                currency: sanitizedData.currency,
                ral_color: sanitizedData.ral_color,
                photos: ensureMainPhoto(photos).map((photo, index) => ({
                    photo_id: photo.photoId,
                    is_main: photo.isMain ?? index === 0,
                })),
            };

            await createListing.mutateAsync(payload);
            reset(defaultValues);
            setPhotos([]);
        } catch (error) {
            setFormError("Failed to create listing. Please try again.");
            console.error("Listing creation error:", error);
        }
    };

    const uploadPhotos = async (files: FileList | null) => {
        if (!files || files.length === 0) {
            return;
        }

        const invalidFile = Array.from(files).find(
            (file) => file.type !== "image/jpeg"
        );
        if (invalidFile) {
            setUploadError("Only JPEG images are allowed");
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            const uploads = await Promise.all(
                Array.from(files).map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);

                    const { data } = await privateAxiosInstance.post<{ photo_id: number }>(
                        "/user/uploadphoto",
                        formData,
                        { headers: { "Content-Type": "multipart/form-data" } }
                    );

                    const photoId = data.photo_id;
                    return {
                        photoId,
                        url: `${import.meta.env.VITE_SERVER_URL}/user/photo/${photoId}`,
                        isMain: false,
                    };
                })
            );

            setPhotos((prev) => ensureMainPhoto([...prev, ...uploads]));
        } catch (error) {
            setUploadError("Failed to upload photos. Please try again.");
            console.error("Photo upload failed:", error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const markAsMain = (photoId: number) => {
        setPhotos((prev) =>
            prev.map((photo) => ({
                ...photo,
                isMain: photo.photoId === photoId,
            }))
        );
    };

    const removePhoto = (photoId: number) => {
        setPhotos((prev) => ensureMainPhoto(prev.filter((photo) => photo.photoId !== photoId)));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-150 flex flex-col items-center gap-4">
            <div className="w-[65%]">
                <Stack gap="4" className="w-full">
                    <Field.Root>
                        <Field.Label fontSize="11px" fontWeight="bolder">
                            Title <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                            {...register("title")}
                            placeholder="Container headline"
                            size="xs"
                        />
                        {errors.title && (
                            <Text role="alert" textStyle="xs" color="red.500">
                                {errors.title.message}
                            </Text>
                        )}
                    </Field.Root>

                    <Field.Root>
                        <Field.Label fontSize="11px" fontWeight="bolder">
                            Description <Field.RequiredIndicator />
                        </Field.Label>
                        <Textarea
                            {...register("description")}
                            placeholder="Add details about the container"
                            size="xs"
                            minH="100px"
                        />
                        {errors.description && (
                            <Text role="alert" textStyle="xs" color="red.500">
                                {errors.description.message}
                            </Text>
                        )}
                    </Field.Root>

                    <Field.Root>
                        <Field.Label fontSize="11px" fontWeight="bolder">
                            Price and currency <Field.RequiredIndicator />
                        </Field.Label>
                        <Flex gap="2" align="center">
                            <Input
                                type="number"
                                step="0.01"
                                {...register("price", {
                                    setValueAs: (val) =>
                                        val === "" || val === null || val === undefined
                                            ? undefined
                                            : Number(val),
                                })}
                                placeholder="0.00"
                                size="xs"
                            />
                            <NativeSelect.Root size="xs">
                                <NativeSelect.Field {...register("currency")}>
                                    {Intl.supportedValuesOf("currency").map((code) => (
                                        <option key={code} value={code}>
                                            {code}
                                        </option>
                                    ))}
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                        </Flex>
                        {errors.price && (
                            <Text role="alert" textStyle="xs" color="red.500">
                                {errors.price.message}
                            </Text>
                        )}
                    </Field.Root>

                    <Field.Root>
                        <Field.Label fontSize="11px" fontWeight="bolder">
                            Listing type <Field.RequiredIndicator />
                        </Field.Label>
                        <NativeSelect.Root size="xs">
                            <NativeSelect.Field {...register("type")}>
                                {Object.entries(listingTypes).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                        {errors.type && (
                            <Text role="alert" textStyle="xs" color="red.500">
                                {errors.type.message}
                            </Text>
                        )}
                    </Field.Root>

                    <Field.Root>
                        <Field.Label fontSize="11px" fontWeight="bolder">
                            Condition <Field.RequiredIndicator />
                        </Field.Label>
                        <NativeSelect.Root size="xs">
                            <NativeSelect.Field {...register("condition")}>
                                {Object.entries(conditionMap).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                        {errors.condition && (
                            <Text role="alert" textStyle="xs" color="red.500">
                                {errors.condition.message}
                            </Text>
                        )}
                    </Field.Root>

                    <Field.Root>
                        <Field.Label fontSize="11px" fontWeight="bolder">
                            Container type <Field.RequiredIndicator />
                        </Field.Label>
                        <NativeSelect.Root size="xs">
                            <NativeSelect.Field {...register("container_type")}>
                                {Object.entries(containerTypes).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                        {errors.container_type && (
                            <Text role="alert" textStyle="xs" color="red.500">
                                {errors.container_type.message}
                            </Text>
                        )}
                    </Field.Root>

                    <Field.Root>
                        <Field.Label fontSize="11px" fontWeight="bolder">
                            Dimension <Field.RequiredIndicator />
                        </Field.Label>
                        <NativeSelect.Root size="xs">
                            <NativeSelect.Field {...register("dimension")}>
                                {Object.entries(containerDimensions).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                        {errors.dimension && (
                            <Text role="alert" textStyle="xs" color="red.500">
                                {errors.dimension.message}
                            </Text>
                        )}
                    </Field.Root>

                    <Field.Root>
                        <Field.Label fontSize="11px" fontWeight="bolder">
                            Location <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                            {...register("location")}
                            placeholder="City, Country"
                            size="xs"
                        />
                        {errors.location && (
                            <Text role="alert" textStyle="xs" color="red.500">
                                {errors.location.message}
                            </Text>
                        )}
                    </Field.Root>

                    <Field.Root>
                        <Field.Label fontSize="11px" fontWeight="bolder">
                            RAL color <Field.RequiredIndicator />
                        </Field.Label>
                        <NativeSelect.Root size="xs">
                            <NativeSelect.Field {...register("ral_color")}>
                                {Object.entries(ralColors).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {`${key} - ${label}`}
                                    </option>
                                ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                        {errors.ral_color && (
                            <Text role="alert" textStyle="xs" color="red.500">
                                {errors.ral_color.message}
                            </Text>
                        )}
                    </Field.Root>

                    <Field.Root>
                        <Field.Label fontSize="11px" fontWeight="bolder">
                            Photos (JPEG, up to 4 MB each)
                        </Field.Label>
                        <Stack gap="2">
                            <Input
                                type="file"
                                accept="image/jpeg"
                                multiple
                                size="xs"
                                ref={fileInputRef}
                                onChange={(e) => uploadPhotos(e.target.files)}
                                disabled={isUploading}
                            />
                            {uploadError && (
                                <Text role="alert" textStyle="xs" color="red.500">
                                    {uploadError}
                                </Text>
                            )}
                            <Flex gap="3" wrap="wrap">
                                {photos.map((photo) => (
                                    <Box
                                        key={photo.photoId}
                                        borderWidth="1px"
                                        borderRadius="md"
                                        padding="2"
                                        width="140px"
                                    >
                                        <Image
                                            src={photo.url}
                                            alt="Listing photo"
                                            width="full"
                                            height="100px"
                                            objectFit="cover"
                                            borderRadius="sm"
                                        />
                                        <Flex justify="space-between" align="center" mt="2">
                                            <Button
                                                size="2xs"
                                                variant={photo.isMain ? "solid" : "outline"}
                                                onClick={() => markAsMain(photo.photoId)}
                                            >
                                                {photo.isMain ? "Main" : "Make main"}
                                            </Button>
                                            <Button
                                                size="2xs"
                                                variant="ghost"
                                                onClick={() => removePhoto(photo.photoId)}
                                            >
                                                Remove
                                            </Button>
                                        </Flex>
                                    </Box>
                                ))}
                            </Flex>
                        </Stack>
                    </Field.Root>

                    {formError && (
                        <Text role="alert" textStyle="sm" color="red.500">
                            {formError}
                        </Text>
                    )}

                    <Box paddingTop="6" alignSelf="center">
                        <Button
                            type="submit"
                            size="sm"
                            className="w-35 font-thin tracking-[1px]"
                            boxShadow="custom"
                            fontWeight="450"
                            isLoading={isSubmitting || isUploading || createListing.isPending}
                        >
                            Create listing
                        </Button>
                    </Box>
                </Stack>
            </div>
        </form>
    );
}
