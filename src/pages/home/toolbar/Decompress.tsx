import {
  Checkbox,
  createDisclosure,
  HStack,
  Input,
  Text,
  VStack,
} from "@hope-ui/solid"
import { useFetch, usePath, useRouter, useT } from "~/hooks"
import { bus, fsArchiveDecompress, handleRespWithNotifySuccess } from "~/utils"
import { createSignal, onCleanup } from "solid-js"
import { ModalFolderChoose } from "~/components"
import { selectedObjs } from "~/store"

export const Decompress = () => {
  const t = useT()
  const { isOpen, onOpen, onClose } = createDisclosure()
  const [loading, ok] = useFetch(fsArchiveDecompress)
  const { pathname } = useRouter()
  const { refresh } = usePath()
  const [archivePass, setArchivePass] = createSignal("")
  const [cacheFull, setCacheFull] = createSignal(true)
  const [putIntoNewDir, setPutIntoNewDir] = createSignal(false)
  const handler = (name: string) => {
    if (name === "decompress") {
      onOpen()
    }
  }
  bus.on("tool", handler)
  onCleanup(() => {
    bus.off("tool", handler)
  })
  return (
    <ModalFolderChoose
      opened={isOpen()}
      onClose={onClose}
      loading={loading()}
      onSubmit={async (dst) => {
        const resp = await ok(
          pathname(),
          dst,
          selectedObjs()[0].name,
          archivePass(),
          "/",
          cacheFull(),
          putIntoNewDir(),
        )
        handleRespWithNotifySuccess(resp, () => {
          refresh()
          onClose()
        })
      }}
      other={
        <VStack spacing="$1" alignItems="flex-start">
          <HStack width="100%" spacing="$1">
            <Text size="sm" css={{ whiteSpace: "nowrap" }}>
              {t(`home.toolbar.decompress-pass`)}
            </Text>
            <Input
              value={archivePass()}
              onInput={(e: any) => setArchivePass(e.target.value as string)}
              size="sm"
              flexGrow="1"
            />
          </HStack>
          <Checkbox
            checked={cacheFull()}
            onChange={(e: any) => setCacheFull(e.target.checked as boolean)}
          >
            {t(`home.toolbar.decompress-cache-full`)}
          </Checkbox>
          <Checkbox
            checked={putIntoNewDir()}
            onChange={(e: any) => setPutIntoNewDir(e.target.checked as boolean)}
          >
            {t(`home.toolbar.decompress-put-into-new`)}
          </Checkbox>
          <div />
        </VStack>
      }
    />
  )
}
