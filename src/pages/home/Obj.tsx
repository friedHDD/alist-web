import { Text, useColorModeValue, VStack } from "@hope-ui/solid"
import {
  Suspense,
  Switch,
  Match,
  lazy,
  createEffect,
  on,
  createSignal,
} from "solid-js"
import { FullLoading, Error, LinkWithBase } from "~/components"
import { resetGlobalPage, useObjTitle, usePath, useRouter, useT } from "~/hooks"
import {
  objStore,
  recordScroll,
  /*layout,*/ State,
  password,
  setPassword,
} from "~/store"

const Folder = lazy(() => import("./folder/Folder"))
const File = lazy(() => import("./file/File"))
const Password = lazy(() => import("./Password"))
// const ListSkeleton = lazy(() => import("./Folder/ListSkeleton"));
// const GridSkeleton = lazy(() => import("./Folder/GridSkeleton"));

const [objBoxRef, setObjBoxRef] = createSignal<HTMLDivElement>()
export { objBoxRef }

let first = true
export const Obj = () => {
  const t = useT()
  const cardBg = useColorModeValue("white", "$neutral3")
  const { pathname } = useRouter()
  const { handlePathChange, refresh } = usePath()
  let lastPathname = pathname()
  createEffect(
    on(pathname, (pathname) => {
      useObjTitle()
      if (!first) {
        resetGlobalPage()
      }
      first = false
      recordScroll(lastPathname, window.scrollY)
      handlePathChange(pathname)
      lastPathname = pathname
    }),
  )
  return (
    <VStack
      ref={(el: HTMLDivElement) => setObjBoxRef(el)}
      class="obj-box"
      w="$full"
      rounded="$xl"
      bgColor={cardBg()}
      p="$2"
      shadow="$lg"
      spacing="$2"
    >
      <Suspense fallback={<FullLoading />}>
        <Switch>
          <Match when={objStore.err}>
            <Error msg={objStore.err} disableColor />
          </Match>
          <Match
            when={[State.FetchingObj, State.FetchingObjs].includes(
              objStore.state,
            )}
          >
            <FullLoading />
            {/* <Show when={layout() === "list"} fallback={<GridSkeleton />}>
              <ListSkeleton />
            </Show> */}
          </Match>
          <Match when={objStore.state === State.NeedPassword}>
            <Password
              title={t("home.input_password")}
              password={password}
              setPassword={setPassword}
              enterCallback={() => refresh(true)}
            >
              <Text>{t("global.have_account")}</Text>
              <Text
                color="$info9"
                as={LinkWithBase}
                href={`/@login?redirect=${encodeURIComponent(
                  location.pathname,
                )}`}
              >
                {t("global.go_login")}
              </Text>
            </Password>
          </Match>
          <Match
            when={[State.Folder, State.FetchingMore].includes(objStore.state)}
          >
            <Folder />
          </Match>
          <Match when={objStore.state === State.File}>
            <File />
          </Match>
        </Switch>
      </Suspense>
    </VStack>
  )
}
