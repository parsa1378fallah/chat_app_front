"use client";
import React, { useState } from "react";
import "@pqina/pintura/pintura.css";
import {
  openEditor,
  locale_en_gb,
  createDefaultImageReader,
  createDefaultImageWriter,
  createDefaultImageOrienter,
  createDefaultShapePreprocessor,
  legacyDataToImageState,
  processImage,
  setPlugins,
  plugin_crop,
  plugin_crop_locale_en_gb,
  plugin_finetune,
  plugin_finetune_locale_en_gb,
  plugin_finetune_defaults,
  plugin_filter,
  plugin_filter_locale_en_gb,
  plugin_filter_defaults,
  plugin_annotate,
  plugin_annotate_locale_en_gb,
  markup_editor_defaults,
  markup_editor_locale_en_gb,
} from "@pqina/pintura";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-file-poster/dist/filepond-plugin-file-poster.min.css";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFilePoster from "filepond-plugin-file-poster";
import FilePondPluginImageEditor from "@pqina/filepond-plugin-image-editor";

import { useAppDispatch } from "@/store/hooks";
import { updateProfile } from "@/store/features/userSlice";

registerPlugin(FilePondPluginImageEditor, FilePondPluginFilePoster);
setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);

const accessToken =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
const refreshToken =
  typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

const headers: Record<string, string> = {};
if (accessToken) headers["access-token"] = accessToken;
if (refreshToken) headers["refresh-token"] = refreshToken;

export default function ExampleFilePond() {
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<any[]>([]); // ⚡ any[] برای رفع خطا

  return (
    <div className="w-full">
      <FilePond
        files={files}
        onupdatefiles={(fileItems: any[]) => setFiles(fileItems)}
        allowMultiple={true}
        filePosterMaxHeight={256}
        name="avatar"
        server={{
          process: {
            url: "https://localhost:5000/api/user/me/uploadUserProfile",
            method: "POST",
            headers,
            onload: (response) => {
              try {
                const res = JSON.parse(response);
                if (res?.data?.profileImage) {
                  dispatch(
                    updateProfile({ profileImage: res.data.profileImage })
                  );
                  console.log("✅ Profile updated:", res.data.profileImage);
                }
                return res;
              } catch (err) {
                console.error("❌ Parse error:", err);
              }
            },
            onerror: (error) => {
              console.error("❌ Upload error:", error);
            },
          },
        }}
        imageEditor={{
          legacyDataToImageState: legacyDataToImageState,
          createEditor: openEditor,
          imageReader: [createDefaultImageReader, {}],
          imageWriter: [createDefaultImageWriter, {}],
          imageProcessor: processImage,
          editorOptions: {
            utils: ["crop", "finetune", "filter", "annotate"],
            imageOrienter: createDefaultImageOrienter(),
            shapePreprocessor: createDefaultShapePreprocessor(),
            ...plugin_finetune_defaults,
            ...plugin_filter_defaults,
            ...markup_editor_defaults,
            locale: {
              ...locale_en_gb,
              ...plugin_crop_locale_en_gb,
              ...plugin_finetune_locale_en_gb,
              ...plugin_filter_locale_en_gb,
              ...plugin_annotate_locale_en_gb,
              ...markup_editor_locale_en_gb,
            },
          },
        }}
      />
    </div>
  );
}
